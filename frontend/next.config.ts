import type { NextConfig } from "next";

function resolveBackendOrigin(phase?: string): string {
  const isTypegen = process.argv.some((arg) => arg.includes("typegen"));
  const isDev =
    phase === "phase-development-server" ||
    process.argv.some((arg) => arg.includes("dev"));

  // Enforce production validation during production builds or production server execution,
  // while preserving localhost fallback during local development, test, and typegen.
  const isProductionBuildOrServer =
    !isDev &&
    !isTypegen &&
    (process.env.NODE_ENV === "production" ||
      phase === "phase-production-build" ||
      phase === "phase-production-server" ||
      process.argv.some((arg) => arg.includes("build") || arg.includes("start")));

  const rawUrl = process.env.BACKEND_INTERNAL_URL?.trim();

  if (!isProductionBuildOrServer) {
    // Preserve localhost fallback for local development, testing, and typegen
    return (rawUrl || "http://localhost:4000").replace(/\/$/, "");
  }

  // Production validation: require valid remote URL and reject localhost
  if (!rawUrl) {
    throw new Error(
      "[next.config.ts] FATAL: BACKEND_INTERNAL_URL is missing in production environment.\n" +
        "You must configure BACKEND_INTERNAL_URL with the public URL of your backend service (e.g., https://mynsut-backend.onrender.com) " +
        "so that Next.js /api/backend rewrites can route API requests."
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error(
      `[next.config.ts] FATAL: BACKEND_INTERNAL_URL is not a valid URL: "${rawUrl}".\n` +
        "Provide a valid HTTP or HTTPS URL (e.g., https://mynsut-backend.onrender.com)."
    );
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(
      `[next.config.ts] FATAL: BACKEND_INTERNAL_URL must use http: or https: protocol. Received "${parsed.protocol}".`
    );
  }

  const hostname = parsed.hostname.toLowerCase();
  const isLoopback =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "0.0.0.0" ||
    hostname.startsWith("127.");

  if (isLoopback) {
    throw new Error(
      `[next.config.ts] FATAL: BACKEND_INTERNAL_URL cannot point to localhost or loopback address in production ("${rawUrl}").\n` +
        "Provide the public or private URL of your live deployed backend service (e.g., https://mynsut-backend.onrender.com)."
    );
  }

  return rawUrl.replace(/\/$/, "");
}

const nextConfig = (phase: string): NextConfig => {
  const backendOrigin = resolveBackendOrigin(phase);
  return {
    devIndicators: false,
    allowedDevOrigins: [
    "192.168.1.10",
    "192.168.1.11",
    "192.168.1.12",
    "192.168.1.7",
    "192.168.1.21",
    "localhost",
    "127.0.0.1",
    "127.0.0.1:3000",
    "10.103.6.147:3000",
  ],
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendOrigin}/api/v1/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  };
};

export default nextConfig;
