import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ParticleBackground } from "@/components/shared/particle-bg";
import { ToastProvider } from "@/contexts/toast-context";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Skills Hub — 高质量LLM技能模板库",
  description: "高质量LLM技能模板，覆盖内容创作、编程开发、数据分析、效率工具、创意写作、思考工作流六大领域。复制即用，去AI味。完美适配 ChatGPT · Claude · Grok · DeepSeek · Qwen 等主流平台。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ParticleBackground />
        <ToastProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 relative z-10">{children}</main>
            <Footer />
            <Toaster />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
