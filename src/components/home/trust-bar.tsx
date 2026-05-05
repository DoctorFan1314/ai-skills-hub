import { skills } from "@/lib/mock-data";

export function TrustBar() {
  const stats = [
    { value: `${skills.length}+`, label: "精选实测模板" },
    { value: "每日", label: "更新" },
    { value: "真实", label: "Before/After 对比" },
    { value: "双适配", label: "在线/本地" },
    { value: "社区", label: "验证" },
  ];
  return (
    <section className="border-y border-border bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
          {stats.map((stat, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-primary" />
              <span className="font-semibold text-foreground">{stat.value}</span>
              <span className="text-muted-foreground">{stat.label}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
