import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Webpack from trying to bundle Node.js-only packages.
  // These must run in the Node.js runtime, not the Edge runtime.
  serverExternalPackages: ["mongoose", "bcryptjs"],

  // Basic security headers applied to all routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
