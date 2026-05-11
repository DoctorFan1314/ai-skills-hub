/**
 * OpenAPI 3.0 specification for OortAPI
 * Covers all AI model and management endpoints
 */

const spec = {
  openapi: "3.0.3",
  info: {
    title: "OortAPI",
    description: "Unified AI API Relay Platform — 一个 API Key 聚合 OpenAI、Anthropic、Google、DeepSeek 等多个上游 AI 服务。",
    version: "3.0.0",
    contact: { name: "OortAPI", url: "https://github.com" },
    license: { name: "Apache 2.0", url: "https://www.apache.org/licenses/LICENSE-2.0" },
  },
  servers: [{ url: "/", description: "Current server" }],
  tags: [
    { name: "AI Models", description: "AI 模型接口 — 兼容 OpenAI API 格式" },
    { name: "Billing", description: "计费与用量查询" },
    { name: "Auth", description: "用户认证" },
    { name: "Dashboard", description: "仪表盘与管理" },
    { name: "System", description: "系统信息" },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        description: "API Key 认证，格式: Bearer sk-oort-xxxx",
      },
      CookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "oortapi_token",
        description: "JWT Cookie 认证（登录后自动设置）",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
      ChatMessage: {
        type: "object",
        required: ["role", "content"],
        properties: {
          role: { type: "string", enum: ["system", "user", "assistant"] },
          content: { type: "string" },
        },
      },
      Model: {
        type: "object",
        properties: {
          id: { type: "string", example: "gpt-4o" },
          object: { type: "string", example: "model" },
          created: { type: "integer", example: 1700000000 },
          owned_by: { type: "string", example: "openai" },
          display_name: { type: "string", example: "GPT-4o" },
          pricing: {
            type: "object",
            properties: {
              input: { type: "number", example: 0.0025 },
              output: { type: "number", example: 0.01 },
              cache: { type: "number", example: 0.00125 },
            },
          },
        },
      },
      Channel: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string", example: "My OpenAI" },
          type: { type: "string", enum: ["openai", "anthropic", "deepseek", "google", "alibaba", "midjourney", "suno"] },
          base_url: { type: "string", nullable: true, example: "https://api.openai.com" },
          weight: { type: "number", example: 1.0 },
          enabled: { type: "integer", enum: [0, 1] },
          models: { type: "string", description: "JSON array of supported model names" },
          model_mapping: { type: "string", description: "JSON object mapping requested→actual model names" },
          status: { type: "string", enum: ["unknown", "online", "offline", "rate_limited"] },
          priority: { type: "integer", example: 0 },
          fail_count: { type: "integer" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer" },
          email: { type: "string", format: "email" },
          username: { type: "string" },
          role: { type: "string", enum: ["user", "admin"] },
          balance: { type: "number" },
          avatar: { type: "string", nullable: true },
          bio: { type: "string", nullable: true },
          preferences: { type: "string", description: "JSON: {theme, language}" },
          created_at: { type: "string", format: "date-time" },
        },
      },
      ApiKey: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string", example: "Default" },
          key_value: { type: "string", example: "sk-oort-abc123..." },
          permissions: { type: "string", description: 'JSON: {"models":["*"]}' },
          rate_limit: { type: "integer", example: 60 },
          enabled: { type: "integer", enum: [0, 1] },
          created_at: { type: "string", format: "date-time" },
          last_used_at: { type: "string", format: "date-time", nullable: true },
          total_calls: { type: "integer" },
        },
      },
      UsageLog: {
        type: "object",
        properties: {
          id: { type: "integer" },
          model: { type: "string" },
          tokens_in: { type: "integer", description: "Total input tokens" },
          tokens_out: { type: "integer", description: "Output tokens" },
          tokens_in_cache: { type: "integer", description: "Cache hit tokens (prompt_tokens_details.cached_tokens)" },
          tokens_cache_creation: { type: "integer", description: "Cache creation tokens (cache_creation_input_tokens)" },
          cost: { type: "number" },
          latency_ms: { type: "integer" },
          success: { type: "integer", enum: [0, 1] },
          cached: { type: "integer", enum: [0, 1] },
          created_at: { type: "string", format: "date-time" },
        },
      },
    },
  },
  paths: {
    // ─── AI Model Endpoints ───
    "/v1/chat/completions": {
      post: {
        tags: ["AI Models"],
        summary: "聊天补全",
        description: "创建聊天补全请求，兼容 OpenAI Chat Completions API。支持流式和非流式响应。",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["model", "messages"],
                properties: {
                  model: { type: "string", example: "gpt-4o", description: "模型名称" },
                  messages: { type: "array", items: { $ref: "#/components/schemas/ChatMessage" } },
                  stream: { type: "boolean", default: false, description: "是否启用流式响应" },
                  temperature: { type: "number", minimum: 0, maximum: 2 },
                  top_p: { type: "number", minimum: 0, maximum: 1 },
                  max_tokens: { type: "integer", minimum: 1 },
                  n: { type: "integer", minimum: 1, default: 1 },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "成功",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    object: { type: "string", example: "chat.completion" },
                    model: { type: "string" },
                    choices: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          index: { type: "integer" },
                          message: { $ref: "#/components/schemas/ChatMessage" },
                          finish_reason: { type: "string" },
                        },
                      },
                    },
                    usage: {
                      type: "object",
                      properties: {
                        prompt_tokens: { type: "integer" },
                        completion_tokens: { type: "integer" },
                        total_tokens: { type: "integer" },
                      },
                    },
                  },
                },
              },
              "text/event-stream": {
                schema: { type: "string", description: "SSE stream (when stream=true)" },
              },
            },
          },
          "401": { description: "无效的 API Key" },
          "402": { description: "余额不足" },
          "429": { description: "请求频率超限" },
          "502": { description: "上游服务错误" },
        },
      },
    },
    "/v1/completions": {
      post: {
        tags: ["AI Models"],
        summary: "文本补全",
        description: "传统文本补全接口，兼容 OpenAI Completions API。",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["model"],
                properties: {
                  model: { type: "string", example: "gpt-3.5-turbo-instruct" },
                  prompt: { type: "string", example: "Say hello" },
                  stream: { type: "boolean", default: false },
                  temperature: { type: "number" },
                  max_tokens: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "成功" },
          "401": { description: "无效的 API Key" },
        },
      },
    },
    "/v1/embeddings": {
      post: {
        tags: ["AI Models"],
        summary: "文本嵌入",
        description: "生成文本嵌入向量，兼容 OpenAI Embeddings API。",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["model", "input"],
                properties: {
                  model: { type: "string", example: "text-embedding-3-small" },
                  input: { oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }], example: "Hello world" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "成功" },
          "401": { description: "无效的 API Key" },
        },
      },
    },
    "/v1/images/generations": {
      post: {
        tags: ["AI Models"],
        summary: "图像生成",
        description: "AI 图像生成接口，兼容 OpenAI Images API。",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["model"],
                properties: {
                  model: { type: "string", example: "dall-e-3" },
                  prompt: { type: "string", example: "A cute cat wearing a hat" },
                  n: { type: "integer", default: 1 },
                  size: { type: "string", example: "1024x1024" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "成功" },
          "401": { description: "无效的 API Key" },
        },
      },
    },
    "/v1/models": {
      get: {
        tags: ["AI Models"],
        summary: "模型列表",
        description: "获取所有可用模型及其定价信息。无需认证。",
        responses: {
          "200": {
            description: "成功",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    object: { type: "string", example: "list" },
                    data: { type: "array", items: { $ref: "#/components/schemas/Model" } },
                  },
                },
              },
            },
          },
        },
      },
    },
    // ─── Billing ───
    "/v1/billing/balance": {
      get: {
        tags: ["Billing"],
        summary: "查询余额",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "成功",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    balance: { type: "number", example: 10.0 },
                    currency: { type: "string", example: "USD" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/v1/billing/usage": {
      get: {
        tags: ["Billing"],
        summary: "用量记录",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer", default: 50, maximum: 100 } },
          { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
        ],
        responses: {
          "200": {
            description: "成功",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    object: { type: "string", example: "list" },
                    data: { type: "array", items: { $ref: "#/components/schemas/UsageLog" } },
                    total: { type: "integer" },
                    has_more: { type: "boolean" },
                  },
                },
              },
            },
          },
        },
      },
    },
    // ─── Auth ───
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "用户登录",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "成功，设置 httpOnly cookie",
            content: { "application/json": { schema: { type: "object", properties: { user: { $ref: "#/components/schemas/User" } } } } },
          },
          "401": { description: "邮箱或密码错误" },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "用户注册",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "email", "password"],
                properties: {
                  username: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "成功，自动登录并赠送初始余额" },
          "409": { description: "邮箱已被注册" },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "获取当前用户",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "成功", content: { "application/json": { schema: { type: "object", properties: { user: { $ref: "#/components/schemas/User" } } } } } },
          "401": { description: "未登录" },
        },
      },
      delete: {
        tags: ["Auth"],
        summary: "退出登录",
        responses: { "200": { description: "成功，清除 cookie" } },
      },
    },
    "/api/auth/profile": {
      patch: {
        tags: ["Auth"],
        summary: "更新个人资料",
        security: [{ CookieAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  avatar: { type: "string" },
                  bio: { type: "string" },
                  preferences: { type: "object" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "成功" },
          "401": { description: "未登录" },
        },
      },
    },
    "/api/auth/change-password": {
      post: {
        tags: ["Auth"],
        summary: "修改密码",
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["currentPassword", "newPassword"],
                properties: {
                  currentPassword: { type: "string" },
                  newPassword: { type: "string", minLength: 6 },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "成功" },
          "400": { description: "当前密码错误" },
        },
      },
    },
    // ─── Dashboard ───
    "/api/dashboard/stats": {
      get: {
        tags: ["Dashboard"],
        summary: "仪表盘统计",
        description: "获取今日/本月调用量、费用、token 使用量、热门模型等统计数据。",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": {
            description: "成功",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    today: {
                      type: "object",
                      properties: {
                        calls: { type: "integer" },
                        success_rate: { type: "number" },
                        cost: { type: "number" },
                        tokens: { type: "integer" },
                        avg_latency: { type: "number" },
                      },
                    },
                    month: {
                      type: "object",
                      properties: {
                        calls: { type: "integer" },
                        cost: { type: "number" },
                        tokens: { type: "integer" },
                      },
                    },
                    active_keys: { type: "integer" },
                    daily_usage: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          date: { type: "string" },
                          calls: { type: "integer" },
                          cost: { type: "number" },
                          tokens: { type: "integer" },
                        },
                      },
                    },
                    top_models: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          model: { type: "string" },
                          calls: { type: "integer" },
                          cost: { type: "number" },
                        },
                      },
                    },
                    balance: { type: "number" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/dashboard/keys": {
      get: {
        tags: ["Dashboard"],
        summary: "API Key 列表",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "成功", content: { "application/json": { schema: { type: "object", properties: { keys: { type: "array", items: { $ref: "#/components/schemas/ApiKey" } } } } } } },
        },
      },
      post: {
        tags: ["Dashboard"],
        summary: "创建 API Key",
        security: [{ CookieAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", default: "Default" },
                  rate_limit: { type: "integer", default: 60 },
                  permissions: { type: "object" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "成功" } },
      },
      patch: {
        tags: ["Dashboard"],
        summary: "更新 API Key",
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id"],
                properties: {
                  id: { type: "integer" },
                  name: { type: "string" },
                  enabled: { type: "boolean" },
                  rate_limit: { type: "integer" },
                  permissions: { type: "object" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "成功" } },
      },
      delete: {
        tags: ["Dashboard"],
        summary: "删除 API Key",
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["id"], properties: { id: { type: "integer" } } } } },
        },
        responses: { "200": { description: "成功" } },
      },
    },
    "/api/dashboard/channels": {
      get: {
        tags: ["Dashboard"],
        summary: "渠道列表",
        description: "获取所有渠道（仅管理员）。",
        security: [{ CookieAuth: [] }],
        responses: {
          "200": { description: "成功", content: { "application/json": { schema: { type: "object", properties: { channels: { type: "array", items: { $ref: "#/components/schemas/Channel" } } } } } } },
          "403": { description: "需要管理员权限" },
        },
      },
      post: {
        tags: ["Dashboard"],
        summary: "创建渠道",
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "type", "api_key_encrypted"],
                properties: {
                  name: { type: "string", example: "My OpenAI" },
                  type: { type: "string", enum: ["openai", "anthropic", "deepseek", "google", "alibaba", "midjourney", "suno"] },
                  api_key_encrypted: { type: "string", description: "上游 API Key" },
                  base_url: { type: "string", example: "https://api.openai.com" },
                  weight: { type: "number", default: 1.0 },
                  priority: { type: "integer", default: 0 },
                  models: { type: "array", items: { type: "string" }, description: "支持的模型列表，空数组=全部" },
                  model_mapping: { type: "object", description: "模型名映射" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "成功" }, "403": { description: "需要管理员权限" } },
      },
      patch: {
        tags: ["Dashboard"],
        summary: "更新渠道",
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id"],
                properties: {
                  id: { type: "integer" },
                  name: { type: "string" },
                  type: { type: "string" },
                  api_key_encrypted: { type: "string" },
                  base_url: { type: "string" },
                  weight: { type: "number" },
                  enabled: { type: "boolean" },
                  models: { type: "array", items: { type: "string" } },
                  model_mapping: { type: "object" },
                  priority: { type: "integer" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "成功" }, "403": { description: "需要管理员权限" } },
      },
      delete: {
        tags: ["Dashboard"],
        summary: "删除渠道",
        security: [{ CookieAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["id"], properties: { id: { type: "integer" } } } } },
        },
        responses: { "200": { description: "成功" }, "403": { description: "需要管理员权限" } },
      },
    },
  },
};

export function getOpenAPISpec() {
  return spec;
}
