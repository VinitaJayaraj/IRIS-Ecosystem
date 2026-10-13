import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/db/:path*",
        destination: "http://127.0.0.1:8000/api/db/:path*",
      },
      {
        source: "/api/fastapi-health",
        destination: "http://127.0.0.1:8000/api/health",
      },
      {
        source: "/api/fastapi/:path*",
        destination: "http://127.0.0.1:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;

