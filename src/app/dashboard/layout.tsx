"use client";

import { useI18n } from "@/contexts/i18n-context";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { AuthGuard } from "@/components/auth/auth-guard";
import { CurrencyProvider } from "@/contexts/currency-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { lang } = useI18n();

  return (
    <AuthGuard>
      <CurrencyProvider>
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <DashboardSidebar />
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </div>
        </div>
      </CurrencyProvider>
    </AuthGuard>
  );
}
