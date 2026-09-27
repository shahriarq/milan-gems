import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder media is served as locally-generated, trusted SVGs during
    // this phase. Real gemstone photography (jpg/png/webp) will replace them
    // without needing this — dangerouslyAllowSVG stays scoped to local /public
    // assets only (no remotePatterns are configured for external SVGs).
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
