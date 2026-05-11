import { NextRequest, NextResponse } from 'next/server';
import { processGatewayRequest } from '@/lib/api-gateway';

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
        return NextResponse.json(
          { error: { message: result.error, type: 'gateway_error' } },
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

      // Create a TransformStream to forward the upstream response
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      const transformStream = new TransformStream({
        async transform(chunk, controller) {
          const text = decoder.decode(chunk, { stream: true });
          controller.enqueue(encoder.encode(text));
        },
        flush(controller) {
          controller.terminate();
        },
      });

      const upstreamBody = streamData.response.body;
      if (upstreamBody) {
        upstreamBody.pipeTo(transformStream.writable).catch(() => {});
      }

      return new Response(transformStream.readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Non-streaming
    const result = await processGatewayRequest(body, authHeader, 'chat/completions');

    if (!result.success) {
      return NextResponse.json(
        { error: { message: result.error, type: 'gateway_error' } },
        { status: result.statusCode || 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Chat completions error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error', type: 'server_error' } },
      { status: 500 }
    );
  }
}
