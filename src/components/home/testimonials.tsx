import { Star } from "lucide-react";
import { testimonials } from "@/lib/mock-data";

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">用户真实反馈</h2>
        <p className="text-[#8b949e]">来自社区用户的使用体验</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <div key={t.id} className="glass-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center text-sm font-bold text-[#00d4ff]">
                {t.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{t.name}</p>
                <p className="text-xs text-[#8b949e]">{t.role}</p>
              </div>
            </div>
            <p className="text-sm text-[#8b949e] leading-relaxed mb-3">&ldquo;{t.content}&rdquo;</p>
            <div className="flex gap-0.5">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
