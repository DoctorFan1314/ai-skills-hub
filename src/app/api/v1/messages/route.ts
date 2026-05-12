import { NextRequest, NextResponse } from 'next/server';
import { processGatewayRequest } from '@/lib/api-gateway';
import { deductBalance, calculateCost, logUsage, getEffectiveMultiplier } from '@/lib/billing-engine';

export const dynamic = 'force-dynamic';

// Anthropic-compatible downstream endpoint
// Accepts: x-api-key header, Anthropic request body format
// Returns: Anthropic response format
export async function POST(request: NextRequest) {
  try {
    // Authenticate with x-api-key (Anthropic style) or Authorization header
    const apiKey = request.headers.get('x-api-key');
    const authHeader = apiKey ? `Bearer ${apiKey}` : request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { type: 'error', error: { type: 'authentication_error', message: 'Missing API key' } },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.model) {
      return NextResponse.json(
        { type: 'error', error: { type: 'invalid_request_error', message: 'model is required' } },
        { status: 400 }
      );
    }

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { type: 'error', error: { type: 'invalid_request_error', message: 'messages array is required' } },
        { status: 400 }
      );
    }

    // Convert Anthropic format to internal gateway format
    const gatewayBody = {
      model: body.model,
      messages: body.messages.map((m: { role: string; content: string | Array<{ type: string; text?: string; tool_use_id?: string; content?: string | Array<{ type: string; text?: string }> }> }) => {
        if (typeof m.content === 'string') {
          return { role: m.role, content: m.content };
        }
        // Map Anthropic content blocks to OpenAI message format
        if (m.role === 'assistant') {
          // Check for tool_use blocks
          const textParts: string[] = [];
          const toolCalls: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }> = [];
          for (const block of m.content) {
            if (block.type === 'text' && block.text) {
              textParts.push(block.text);
            }
            if (block.type === 'tool_use') {
              toolCalls.push({
                id: (block as { id?: string }).id || '',
                type: 'function',
                function: {
                  name: (block as { name?: string }).name || '',
                  arguments: JSON.stringify((block as { input?: unknown }).input || {}),
                },
              });
            }
          }
          const msg: Record<string, unknown> = { role: 'assistant', content: textParts.join('') || null };
          if (toolCalls.length > 0) msg.tool_calls = toolCalls;
          return msg;
        }
        if (m.role === 'user') {
          // Check for tool_result blocks
          const toolResults: Array<{ role: 'tool'; tool_call_id: string; content: string }> = [];
          const textParts: string[] = [];
          for (const block of m.content) {
            if (block.type === 'tool_result') {
              const resultContent = typeof block.content === 'string' ? block.content
                : Array.isArray(block.content) ? block.content.map((c) => (c as { text?: string }).text || '').join('')
                : '';
              toolResults.push({
                role: 'tool',
                tool_call_id: block.tool_use_id || '',
                content: resultContent,
              });
            } else if (block.type === 'text' && block.text) {
              textParts.push(block.text);
            }
          }
          if (toolResults.length > 0) {
            // Return tool results as separate messages (OpenAI format)
            if (textParts.length > 0) {
              return [{ role: 'user', content: textParts.join('') }, ...toolResults];
            }
            return toolResults;
          }
          return { role: 'user', content: textParts.join('') };
        }
        // system or other roles
        return {
          role: m.role,
          content: typeof m.content === 'string' ? m.content
            : m.content.map((c) => (c as { text?: string }).text || '').join(''),
        };
      }).flat(),
      max_tokens: body.max_tokens,
      temperature: body.temperature,
      top_p: body.top_p,
      stream: body.stream || false,
      // Forward tools if provided (convert Anthropic tools format to OpenAI if needed)
      tools: body.tools,
      tool_choice: body.tool_choice,
    };

    // Handle streaming
    if (body.stream) {
      const result = await processGatewayRequest(gatewayBody, authHeader, 'chat/completions');
      if (!result.success) {
        return NextResponse.json(
          { type: 'error', error: { type: 'api_error', message: result.error } },
          { status: result.statusCode || 500 }
        );
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
      const msgId = `msg_${Date.now().toString(36)}`;

      function doLogUsage() {
        if (logged) return;
        logged = true;

        if (tokensIn === 0) tokensIn = estimateTokens(JSON.stringify(body.messages));
        if (tokensOut === 0 && completionText) tokensOut = estimateTokens(completionText);

        const latencyMs = Date.now() - streamData.startTime;
        const { multiplier } = getEffectiveMultiplier(streamData.model);
        const baseCost = calculateCost(streamData.model, tokensIn, tokensOut, false, tokensInCache, tokensCacheCreation);
        const cost = baseCost * multiplier;

        if (cost > 0) {
          deductBalance(streamData.userId, cost, `API call: ${streamData.model}`);
        }

        logUsage({
          userId: streamData.userId,
          apiKeyId: streamData.apiKeyId,
          channelId: streamData.channelId,
          model: streamData.model,
          tokensIn, tokensOut, tokensInCache, tokensCacheCreation,
          cost, latencyMs, success: true, multiplier,
        });
      }

      // The upstream may return Anthropic SSE (from anthropic channels) or OpenAI SSE (from openai channels).
      // We normalize to Anthropic SSE format for the downstream client.
      const isUpstreamAnthropic = streamData.response.headers.get('content-type')?.includes('text/event-stream');

      let sentMessageStart = false;
      let contentBlockIndex = 0;
      let currentText = '';
      let toolUseBlocks: Array<{ id: string; name: string; input: string }> = [];
      let sentToolBlocks = false;

      const transformStream = new TransformStream({
        transform(chunk, controller) {
          const text = decoder.decode(chunk, { stream: true });
          buffer += text;
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ') && !line.startsWith('event: ')) continue;

            // Check if upstream is Anthropic format
            if (line.startsWith('event: ')) {
              // Anthropic SSE — forward events directly but capture usage
              const eventType = line.slice(7).trim();
              // We'll handle the data line that follows
              continue;
            }

            const data = line.slice(6).trim();
            if (!data || data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);

              // Detect Anthropic format (has 'type' field)
              if (parsed.type === 'message_start') {
                // Anthropic streaming — forward as-is, capture usage
                tokensIn = parsed.message?.usage?.input_tokens || tokensIn;
                tokensInCache = parsed.message?.usage?.cache_read_input_tokens || tokensInCache;
                tokensCacheCreation = parsed.message?.usage?.cache_creation_input_tokens || tokensCacheCreation;
                controller.enqueue(encoder.encode(`event: message_start\ndata: ${JSON.stringify(parsed)}\n\n`));
                sentMessageStart = true;
                continue;
              }

              if (parsed.type === 'content_block_start') {
                controller.enqueue(encoder.encode(`event: content_block_start\ndata: ${JSON.stringify(parsed)}\n\n`));
                continue;
              }

              if (parsed.type === 'content_block_delta') {
                const deltaType = parsed.delta?.type;
                if (deltaType === 'text_delta') {
                  const deltaText = parsed.delta?.text || '';
                  if (deltaText) {
                    currentText += deltaText;
                    completionText += deltaText;
                  }
                }
                // tool_use deltas (input_json_delta) are forwarded as-is
                controller.enqueue(encoder.encode(`event: content_block_delta\ndata: ${JSON.stringify(parsed)}\n\n`));
                continue;
              }

              if (parsed.type === 'content_block_stop') {
                controller.enqueue(encoder.encode(`event: content_block_stop\ndata: ${JSON.stringify(parsed)}\n\n`));
                contentBlockIndex++;
                continue;
              }

              if (parsed.type === 'message_delta') {
                tokensOut = parsed.usage?.output_tokens || tokensOut;
                controller.enqueue(encoder.encode(`event: message_delta\ndata: ${JSON.stringify(parsed)}\n\n`));
                continue;
              }

              if (parsed.type === 'message_stop') {
                controller.enqueue(encoder.encode(`event: message_stop\ndata: ${JSON.stringify(parsed)}\n\n`));
                continue;
              }

              if (parsed.type === 'ping') {
                controller.enqueue(encoder.encode(`event: ping\ndata: ${JSON.stringify(parsed)}\n\n`));
                continue;
              }

              // OpenAI format — convert to Anthropic format
              if (parsed.choices) {
                const delta = parsed.choices?.[0]?.delta;
                const finishReason = parsed.choices?.[0]?.finish_reason;

                if (!sentMessageStart) {
                  const startEvent = {
                    type: 'message_start',
                    message: {
                      id: msgId,
                      type: 'message',
                      role: 'assistant',
                      content: [],
                      model: streamData.model,
                      stop_reason: null,
                      usage: { input_tokens: 0, output_tokens: 0 },
                    },
                  };
                  controller.enqueue(encoder.encode(`event: message_start\ndata: ${JSON.stringify(startEvent)}\n\n`));
                  sentMessageStart = true;
                }

                // Handle text content
                if (delta?.content) {
                  if (!sentToolBlocks && toolUseBlocks.length === 0) {
                    // Only emit text block if no tool calls were seen
                    // (Anthropic puts text and tool_use as separate content blocks)
                  }
                  completionText += delta.content;
                  // If this is the first text content, emit a text block_start
                  if (currentText === '') {
                    const blockStart = { type: 'content_block_start', index: contentBlockIndex, content_block: { type: 'text', text: '' } };
                    controller.enqueue(encoder.encode(`event: content_block_start\ndata: ${JSON.stringify(blockStart)}\n\n`));
                  }
                  currentText += delta.content;
                  const blockDelta = { type: 'content_block_delta', index: contentBlockIndex, delta: { type: 'text_delta', text: delta.content } };
                  controller.enqueue(encoder.encode(`event: content_block_delta\ndata: ${JSON.stringify(blockDelta)}\n\n`));
                }

                // Handle tool_calls from OpenAI delta
                if (delta?.tool_calls) {
                  for (const tc of delta.tool_calls) {
                    const idx = tc.index ?? 0;
                    // Ensure tool block exists
                    while (toolUseBlocks.length <= idx) {
                      toolUseBlocks.push({ id: '', name: '', input: '' });
                    }
                    if (tc.id) toolUseBlocks[idx].id = tc.id;
                    if (tc.function?.name) toolUseBlocks[idx].name = tc.function.name;
                    if (tc.function?.arguments) toolUseBlocks[idx].input += tc.function.arguments;
                  }
                }

                // Capture usage
                if (parsed.usage) {
                  tokensIn = parsed.usage.prompt_tokens || parsed.usage.input_tokens || tokensIn;
                  tokensOut = parsed.usage.completion_tokens || parsed.usage.output_tokens || tokensOut;
                  tokensInCache = parsed.usage.prompt_tokens_details?.cached_tokens || parsed.usage.cache_read_input_tokens || tokensInCache;
                  tokensCacheCreation = parsed.usage.cache_creation_input_tokens || tokensCacheCreation;
                }

                // Handle finish_reason
                if (finishReason) {
                  // Close text block if one was open
                  if (currentText) {
                    controller.enqueue(encoder.encode(`event: content_block_stop\ndata: ${JSON.stringify({ type: 'content_block_stop', index: contentBlockIndex })}\n\n`));
                    contentBlockIndex++;
                    currentText = '';
                  }

                  // Emit tool_use blocks (convert from OpenAI tool_calls to Anthropic tool_use)
                  if (toolUseBlocks.length > 0) {
                    for (const tb of toolUseBlocks) {
                      const toolBlockStart = {
                        type: 'content_block_start',
                        index: contentBlockIndex,
                        content_block: { type: 'tool_use', id: tb.id, name: tb.name, input: {} },
                      };
                      controller.enqueue(encoder.encode(`event: content_block_start\ndata: ${JSON.stringify(toolBlockStart)}\n\n`));

                      // Send input as a single input_json_delta
                      if (tb.input) {
                        const inputDelta = {
                          type: 'content_block_delta',
                          index: contentBlockIndex,
                          delta: { type: 'input_json_delta', partial_json: tb.input },
                        };
                        controller.enqueue(encoder.encode(`event: content_block_delta\ndata: ${JSON.stringify(inputDelta)}\n\n`));
                      }

                      controller.enqueue(encoder.encode(`event: content_block_stop\ndata: ${JSON.stringify({ type: 'content_block_stop', index: contentBlockIndex })}\n\n`));
                      contentBlockIndex++;
                    }
                    toolUseBlocks = [];
                    sentToolBlocks = true;
                  }

                  // Map finish reason to Anthropic stop_reason
                  const stopReason = finishReason === 'stop' ? 'end_turn'
                    : finishReason === 'length' ? 'max_tokens'
                    : finishReason === 'tool_calls' ? 'tool_use'
                    : 'end_turn';
                  const messageDelta = {
                    type: 'message_delta',
                    delta: { stop_reason: stopReason, stop_sequence: null },
                    usage: { output_tokens: tokensOut },
                  };
                  controller.enqueue(encoder.encode(`event: message_delta\ndata: ${JSON.stringify(messageDelta)}\n\n`));
                  controller.enqueue(encoder.encode(`event: message_stop\ndata: ${JSON.stringify({ type: 'message_stop' })}\n\n`));
                }
              }
            } catch {
              // Not valid JSON, skip
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
          doLogUsage();
        });
      }

      return new Response(transformStream.readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no',
        },
      });
    }

    // Non-streaming
    const result = await processGatewayRequest(gatewayBody, authHeader, 'chat/completions');

    if (!result.success) {
      return NextResponse.json(
        { type: 'error', error: { type: 'api_error', message: result.error } },
        { status: result.statusCode || 500 }
      );
    }

    const data = result.data as Record<string, unknown>;
    const usage = (data as { usage?: Record<string, unknown> }).usage || {};

    // Build content blocks from OpenAI response
    const content: Array<Record<string, unknown>> = [];
    const choice = (data as { choices?: Array<{ message?: Record<string, unknown> }> }).choices?.[0]?.message;
    const text = choice?.content as string;
    if (text) {
      content.push({ type: 'text', text });
    }

    // Convert OpenAI tool_calls to Anthropic tool_use content blocks
    const toolCalls = choice?.tool_calls as Array<{ id: string; type: string; function: { name: string; arguments: string } }> | undefined;
    if (toolCalls) {
      for (const tc of toolCalls) {
        let parsedInput: unknown = {};
        try { parsedInput = JSON.parse(tc.function.arguments); } catch { /* keep empty */ }
        content.push({
          type: 'tool_use',
          id: tc.id,
          name: tc.function.name,
          input: parsedInput,
        });
      }
    }

    // Convert OpenAI response to Anthropic format
    const anthropicResponse = {
      id: (data as { id?: string }).id || `msg_${Date.now().toString(36)}`,
      type: 'message',
      role: 'assistant',
      content,
      model: (data as { model?: string }).model || body.model,
      stop_reason: (() => {
        const reason = (data as { choices?: Array<{ finish_reason?: string }> }).choices?.[0]?.finish_reason;
        if (reason === 'stop') return 'end_turn';
        if (reason === 'length') return 'max_tokens';
        if (reason === 'tool_calls') return 'tool_use';
        return 'end_turn';
      })(),
      usage: {
        input_tokens: (usage as { prompt_tokens?: number }).prompt_tokens || (usage as { input_tokens?: number }).input_tokens || 0,
        output_tokens: (usage as { completion_tokens?: number }).completion_tokens || (usage as { output_tokens?: number }).output_tokens || 0,
        cache_creation_input_tokens: (usage as { cache_creation_input_tokens?: number }).cache_creation_input_tokens || 0,
        cache_read_input_tokens: (usage as { prompt_tokens_details?: { cached_tokens?: number } }).prompt_tokens_details?.cached_tokens || (usage as { cache_read_input_tokens?: number }).cache_read_input_tokens || 0,
      },
    };

    return NextResponse.json(anthropicResponse);
  } catch (error) {
    console.error('Anthropic messages error:', error);
    return NextResponse.json(
      { type: 'error', error: { type: 'api_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

function estimateTokens(text: string): number {
  const chineseChars = (text.match(/[一-鿿]/g) || []).length;
  const otherChars = text.length - chineseChars;
  return Math.ceil(chineseChars / 2 + otherChars / 4);
}
