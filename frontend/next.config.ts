import type { NextConfig } from "next";

const backendOrigin = (process.env.BACKEND_INTERNAL_URL ?? "http://localhost:4000").replace(
  /\/$/,
  ""
);

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["192.168.1.10", "192.168.1.11", "192.168.1.12", "localhost"],
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
