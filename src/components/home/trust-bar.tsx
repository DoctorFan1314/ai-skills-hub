export function TrustBar() {
  const stats = [
    "已收录 1284+ 个精选实测模板",
    "每日更新",
    "真实 Before/After 对比",
    "在线/本地双适配",
    "社区验证",
  ];
  return (
    <section className="border-y border-white/[0.06] bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#8b949e]">
          {stats.map((stat, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[#00d4ff]" />
              {stat}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
