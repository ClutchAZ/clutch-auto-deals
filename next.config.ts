import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "static.wixstatic.com" },
      { protocol: "https", hostname: "cdn.imagin.studio" },
    ],
  },
  // Old Wix URLs -> new pages, so existing Google rankings and links carry over.
  async redirects() {
    return [
      { source: "/general-8", destination: "/reviews", permanent: true },
      { source: "/sellmycar", destination: "/sell-your-car", permanent: true },
      { source: "/forum", destination: "/", permanent: true },
      { source: "/forum/:path*", destination: "/", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/inventory", destination: "/deals", permanent: true },
      { source: "/blank", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
