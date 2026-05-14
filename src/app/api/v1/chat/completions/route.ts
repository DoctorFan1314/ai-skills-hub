import { NextRequest, NextResponse } from 'next/server';
import { processGatewayRequest, estimateTokens, setRateLimitHeaders } from '@/lib/api-gateway';
import { deductCreditsOrBalance, calculateCost, calculateCredits, logUsage, getEffectiveMultiplier } from '@/lib/billing-engine';
import { reportChannelSuccess } from '@/lib/channel-manager';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    if (!body.model) {
      return NextResponse.json(
        { error: { message: 'model is required', type: 'invalid_request_error' } },
        { status: 400 }
      );
    }

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: { message: 'messages array is required', type: 'invalid_request_error' } },
        { status: 400 }
      );
    }

    // Handle streaming
    if (body.stream) {
      const result = await processGatewayRequest(body, authHeader, 'chat/completions');
      if (!result.success) {
        const res = NextResponse.json(
          { error: { message: result.error, type: 'gateway_error' } },
          { status: result.statusCode || 500 }
        );
        setRateLimitHeaders(res.headers, result.rateLimit);
        return res;
      }

      const streamData = result.data as {
        response: Response;
        channelId: number;
        userId: number;
        apiKeyId: number;
        model: string;
        startTime: number;
      };

      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      let buffer = '';
      let tokensIn = 0;
      let tokensOut = 0;
      let tokensInCache = 0;
      let tokensCacheCreation = 0;
      let completionText = '';
      let logged = false;

      function doLogUsage() {
        if (logged) return;
        logged = true;

        // Stream completed successfully — report channel health
        reportChannelSuccess(streamData.channelId);

        if (tokensIn === 0) {
          tokensIn = estimateTokens(JSON.stringify(body.messages));
        }
        if (tokensOut === 0 && completionText) {
          tokensOut = estimateTokens(completionText);
        }

        const latencyMs = Date.now() - streamData.startTime;
        const { multiplier } = getEffectiveMultiplier(streamData.model);
        const baseCost = calculateCost(streamData.model, tokensIn, tokensOut, false, tokensInCache, tokensCacheCreation);
        const cost = baseCost * multiplier;

        let deductResult: { source: string } | undefined;
        if (cost > 0) {
          deductResult = deductCreditsOrBalance(streamData.userId, streamData.model, cost, `API call: ${streamData.model}`, tokensIn, tokensOut, tokensInCache, tokensCacheCreation);
        }

        logUsage({
          userId: streamData.userId,
          apiKeyId: streamData.apiKeyId,
          channelId: streamData.channelId,
          model: streamData.model,
          tokensIn,
          tokensOut,
          tokensInCache,
          tokensCacheCreation,
          cost,
          creditsUsed: deductResult?.source === 'credits' ? (tokensIn + tokensOut) : 0,
          deductionSource: deductResult?.source || 'balance',
          latencyMs,
          success: true,
          multiplier,
        });
      }

      const transformStream = new TransformStream({
        transform(chunk, controller) {
          const text = decoder.decode(chunk, { stream: true });
          buffer += text;

          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              // Forward [DONE] as-is — clients need it to know the stream ended
              if (data === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                continue;
              }
              try {
                const parsed = JSON.parse(data);
                if (parsed.usage) {
                  tokensIn = parsed.usage.prompt_tokens || parsed.usage.input_tokens || tokensIn;
                  tokensOut = parsed.usage.completion_tokens || parsed.usage.output_tokens || tokensOut;
                  // OpenAI: prompt_tokens_details.cached_tokens; Anthropic: cache_read_input_tokens
                  tokensInCache = parsed.usage.prompt_tokens_details?.cached_tokens || parsed.usage.cache_read_input_tokens || tokensInCache;
                  tokensCacheCreation = parsed.usage.cache_creation_input_tokens || tokensCacheCreation;
                }
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) completionText += delta;
              } catch {
                // Not valid JSON, skip
              }
            }
          }

          controller.enqueue(encoder.encode(text));
        },
        flush() {
          doLogUsage();
        },
      });

      const upstreamBody = streamData.response.body;
      if (upstreamBody) {
        upstreamBody.pipeTo(transformStream.writable).catch(() => {
          // If pipe fails, still log what we have
          doLogUsage();
        });
      }

      const rateLimitHeaders: Record<string, string> = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      };
      if (result.rateLimit) {
        rateLimitHeaders['X-RateLimit-Limit'] = String(result.rateLimit.limit);
        rateLimitHeaders['X-RateLimit-Remaining'] = String(result.rateLimit.remaining);
        rateLimitHeaders['X-RateLimit-Reset'] = String(Math.ceil(result.rateLimit.resetAt / 1000));
      }

      return new Response(transformStream.readable, { headers: rateLimitHeaders });
    }

    // Non-streaming
    const result = await processGatewayRequest(body, authHeader, 'chat/completions');

    if (!result.success) {
      const res = NextResponse.json(
        { error: { message: result.error, type: 'gateway_error' } },
        { status: result.statusCode || 500 }
      );
      setRateLimitHeaders(res.headers, result.rateLimit);
      return res;
    }

    const res = NextResponse.json(result.data);
    setRateLimitHeaders(res.headers, result.rateLimit);
    return res;
  } catch (error) {
    console.error('Chat completions error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', type: 'server_error' } },
      { status: 500 }
    );
  }
}
