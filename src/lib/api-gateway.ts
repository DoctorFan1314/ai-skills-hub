import db from './db';
import type { DBApiKey, DBUser } from './db';
import { verifyToken, getTokenFromCookie } from './auth';
import { checkRateLimit, type RateLimitResult } from './rate-limiter';
import { deductBalance, calculateCost, logUsage } from './billing-engine';
import { selectChannel, reportChannelFailure, reportChannelSuccess } from './channel-manager';

export interface GatewayRequest {
  model: string;
  messages?: Array<{ role: string; content: string }>;
  prompt?: string;
  input?: string | string[];
  [key: string]: unknown;
}

export interface GatewayResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  statusCode?: number;
}

// Validate API Key from Authorization header
export function validateApiKey(authHeader: string | null): { valid: boolean; apiKey?: DBApiKey; user?: DBUser; error?: string } {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing or invalid Authorization header' };
  }

  const keyValue = authHeader.slice(7).trim();
  if (!keyValue) {
    return { valid: false, error: 'Empty API key' };
  }

  const apiKey = db.prepare('SELECT * FROM api_keys WHERE key_value = ? AND enabled = 1').get(keyValue) as DBApiKey | undefined;
  if (!apiKey) {
    return { valid: false, error: 'Invalid or disabled API key' };
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(apiKey.user_id) as DBUser | undefined;
  if (!user) {
    return { valid: false, error: 'User not found' };
  }

  // Update last used timestamp
  db.prepare('UPDATE api_keys SET last_used_at = CURRENT_TIMESTAMP, total_calls = total_calls + 1 WHERE id = ?').run(apiKey.id);

  return { valid: true, apiKey, user };
}

// Validate user from cookie (for dashboard API routes)
export function validateUserFromCookie(cookieHeader: string | null): { valid: boolean; user?: DBUser; error?: string } {
  const token = getTokenFromCookie(cookieHeader);
  if (!token) return { valid: false, error: 'Not authenticated' };

  const payload = verifyToken(token);
  if (!payload) return { valid: false, error: 'Invalid or expired token' };

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.userId) as DBUser | undefined;
  if (!user) return { valid: false, error: 'User not found' };

  return { valid: true, user };
}

// Process an API request through the gateway
export async function processGatewayRequest(
  req: GatewayRequest,
  authHeader: string | null,
  endpoint: 'chat/completions' | 'completions' | 'images/generations' | 'embeddings'
): Promise<GatewayResponse> {
  // 1. Validate API key
  const auth = validateApiKey(authHeader);
  if (!auth.valid || !auth.apiKey || !auth.user) {
    return { success: false, error: auth.error || 'Unauthorized', statusCode: 401 };
  }

  const { apiKey, user } = auth;

  // 2. Check rate limit
  const rateLimit = checkRateLimit(apiKey.id, apiKey.rate_limit);
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Rate limit exceeded. Try again after ${new Date(rateLimit.resetAt).toISOString()}`,
      statusCode: 429,
    };
  }

  // 3. Check balance
  if (user.balance <= 0) {
    return { success: false, error: 'Insufficient balance. Please recharge.', statusCode: 402 };
  }

  // 4. Select channel
  const selection = selectChannel(req.model);
  if (!selection) {
    return { success: false, error: `No available channel for model: ${req.model}`, statusCode: 503 };
  }

  const { channel, model: actualModel } = selection;
  const startTime = Date.now();

  try {
    // 5. Forward request to upstream provider
    const upstreamUrl = buildUpstreamUrl(channel.base_url || '', endpoint, channel.type);
    const upstreamBody = buildUpstreamRequest({ ...req, model: actualModel }, channel.type);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (channel.type === 'anthropic') {
      headers['x-api-key'] = channel.api_key_encrypted;
      headers['anthropic-version'] = '2023-06-01';
    } else {
      headers['Authorization'] = `Bearer ${channel.api_key_encrypted}`;
    }

    const upstreamRes = await fetch(upstreamUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(upstreamBody),
    });

    const latencyMs = Date.now() - startTime;

    if (!upstreamRes.ok) {
      const errorText = await upstreamRes.text();
      reportChannelFailure(channel.id, errorText);

      logUsage({
        userId: user.id,
        apiKeyId: apiKey.id,
        channelId: channel.id,
        model: req.model,
        tokensIn: 0,
        tokensOut: 0,
        cost: 0,
        latencyMs,
        success: false,
        errorMessage: errorText,
      });

      return { success: false, error: `Upstream error: ${errorText}`, statusCode: upstreamRes.status };
    }

    // Handle streaming response
    if (req.stream) {
      reportChannelSuccess(channel.id);
      // For streaming, we return the raw response
      // Token counting happens in the streaming handler
      return {
        success: true,
        data: {
          stream: true,
          response: upstreamRes,
          channelId: channel.id,
          userId: user.id,
          apiKeyId: apiKey.id,
          model: req.model,
          startTime,
        },
      };
    }

    // Non-streaming response
    const data = await upstreamRes.json();
    reportChannelSuccess(channel.id);

    // Calculate tokens and cost (including cache tokens)
    const tokensIn = data.usage?.prompt_tokens || estimateTokens(JSON.stringify(req.messages || req.prompt || ''));
    const tokensOut = data.usage?.completion_tokens || estimateTokens(JSON.stringify(data.choices?.[0]?.message?.content || ''));
    const tokensInCache = data.usage?.prompt_tokens_details?.cached_tokens || 0;
    const tokensCacheCreation = data.usage?.cache_creation_input_tokens || 0;
    const cost = calculateCost(req.model, tokensIn, tokensOut, false, tokensInCache, tokensCacheCreation);

    // Deduct balance
    const deductResult = deductBalance(user.id, cost, `API call: ${req.model}`);
    if (!deductResult.success) {
      console.error('Failed to deduct balance:', deductResult.error);
    }

    // Log usage
    logUsage({
      userId: user.id,
      apiKeyId: apiKey.id,
      channelId: channel.id,
      model: req.model,
      tokensIn,
      tokensOut,
      tokensInCache,
      tokensCacheCreation,
      cost,
      latencyMs,
      success: true,
    });

    return { success: true, data };
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    reportChannelFailure(channel.id, String(error));

    logUsage({
      userId: user.id,
      apiKeyId: apiKey.id,
      channelId: channel.id,
      model: req.model,
      tokensIn: 0,
      tokensOut: 0,
      cost: 0,
      latencyMs,
      success: false,
      errorMessage: String(error),
    });

    return { success: false, error: `Gateway error: ${error}`, statusCode: 502 };
  }
}

// Build upstream URL based on provider type
function buildUpstreamUrl(baseUrl: string, endpoint: string, providerType: string): string {
  const base = baseUrl.replace(/\/$/, '');

  // Anthropic uses /v1/messages instead of /v1/chat/completions
  if (providerType === 'anthropic' && endpoint === 'chat/completions') {
    return `${base}/v1/messages`;
  }

  return `${base}/v1/${endpoint}`;
}

// Build upstream request body based on provider type
function buildUpstreamRequest(req: GatewayRequest, providerType: string): unknown {
  if (providerType === 'anthropic') {
    return {
      model: req.model,
      messages: req.messages,
      max_tokens: req.max_tokens || 4096,
      stream: req.stream || false,
      temperature: req.temperature,
      top_p: req.top_p,
    };
  }

  // OpenAI-compatible (default for most providers)
  const body: Record<string, unknown> = {
    model: req.model,
    messages: req.messages,
    prompt: req.prompt,
    input: req.input,
    stream: req.stream || false,
    temperature: req.temperature,
    top_p: req.top_p,
    max_tokens: req.max_tokens,
    n: req.n,
    size: req.size,
  };

  // Request usage data in streaming responses
  if (req.stream) {
    body.stream_options = { include_usage: true };
  }

  return body;
}

// Simple token estimation (4 chars ~= 1 token for English, 2 chars ~= 1 for Chinese)
function estimateTokens(text: string): number {
  const chineseChars = (text.match(/[一-鿿]/g) || []).length;
  const otherChars = text.length - chineseChars;
  return Math.ceil(chineseChars / 2 + otherChars / 4);
}
