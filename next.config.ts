import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    // 覆盖所有 RFC 1918 私有网段，任意局域网 IP 均可访问
    "http://192.168.*",
    "http://10.*",
    "http://172.16.*",
    "http://172.17.*",
    "http://172.18.*",
    "http://172.19.*",
    "http://172.2*",
    "http://172.30.*",
    "http://172.31.*",
  ],
};

export default nextConfig;
