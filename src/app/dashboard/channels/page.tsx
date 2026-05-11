"use client";

import { useI18n } from "@/contexts/i18n-context";
import { ChannelCard } from "@/components/dashboard/channel-card";

export default function ChannelsPage() {
  const { lang } = useI18n();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {lang === "zh" ? "渠道管理" : "Channel Management"}
      </h1>
      <ChannelCard lang={lang} />
    </div>
  );
}
