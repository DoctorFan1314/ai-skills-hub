import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-primary mb-4">404</p>
        <h1 className="text-2xl font-bold text-foreground mb-2">页面未找到</h1>
        <p className="text-muted-foreground mb-8">你访问的页面不存在或已被移除</p>
        <Link href="/">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" />返回首页
          </Button>
        </Link>
      </div>
    </div>
  );
}
