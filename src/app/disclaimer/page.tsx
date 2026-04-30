"use client";

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <h1 className="text-3xl font-bold text-white mb-8">免责声明</h1>

      <div className="glass-card p-8 space-y-6 text-[#8b949e] leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">1. 平台声明</h2>
          <p>
            AI Skills Hub（以下简称「本平台」）是一个独立的技能模板分享平台，与以下公司及其产品
            <strong className="text-white">不存在任何隶属、授权、赞助或合作关系</strong>：
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>OpenAI（ChatGPT）</li>
            <li>Anthropic（Claude）</li>
            <li>xAI（Grok）</li>
            <li>DeepSeek</li>
            <li>阿里巴巴（Qwen / 通义千问）</li>
            <li>Meta（Llama 系列）</li>
            <li>LM Studio、Ollama 等本地部署工具</li>
          </ul>
          <p className="mt-3">
            ChatGPT、Claude、Grok、DeepSeek、Qwen、Llama 等名称和商标均为各自公司的注册商标，
            本平台仅用于指示性说明（nominative use），不构成商标侵权。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">2. 内容免责</h2>
          <p>
            本平台提供的 Prompt 模板及使用指南仅供参考。由于 AI 模型的输出具有不确定性，
            我们<strong className="text-white">不保证</strong>：
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>AI 输出的准确性、完整性或可靠性</li>
            <li>模板在所有模型版本上的效果一致性</li>
            <li>AI 输出内容不包含错误、偏见或不当信息</li>
          </ul>
          <p className="mt-3">
            用户应自行判断 AI 输出内容的适用性，并对使用结果承担全部责任。
            对于因使用本平台模板而产生的任何直接或间接损失，本平台不承担责任。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">3. 用户生成内容</h2>
          <p>
            用户通过本平台提交的模板内容由用户自行负责。本平台不对用户提交内容的合法性、
            准确性或原创性作出保证。如发现侵权内容，请通过以下方式联系我们，我们将在收到
            通知后尽快处理：
          </p>
          <p className="mt-2 text-[#00d4ff]">contact@aiskillshub.com</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">4. 第三方链接</h2>
          <p>
            本平台可能包含指向第三方网站的链接。这些链接仅为用户便利提供，
            本平台不对第三方网站的内容、隐私政策或做法负责。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">5. 合理使用</h2>
          <p>
            本平台倡导用户遵守各 AI 平台的服务条款（Terms of Service）。
            用户使用本平台模板时，应自行确保符合所使用 AI 平台的相关规定。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-3">6. 免责声明的修改</h2>
          <p>
            本平台保留随时修改本免责声明的权利。修改后的声明将在本页面公布，
            继续使用本平台即视为接受修改后的条款。
          </p>
        </section>

        <p className="text-sm text-[#8b949e]/60 pt-4 border-t border-white/10">
          最后更新：2026 年 4 月
        </p>
      </div>
    </div>
  );
}
