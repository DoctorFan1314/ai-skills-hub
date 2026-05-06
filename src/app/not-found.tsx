"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/contexts/i18n-context";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-primary mb-4">404</p>
        <h1 className="text-2xl font-bold text-foreground mb-2">{t.notFound.title}</h1>
        <p className="text-muted-foreground mb-8">{t.notFound.description}</p>
        <Link href="/">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" />{t.notFound.backHome}
          </Button>
        </Link>
      </div>
    </div>
  );
}
