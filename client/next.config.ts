import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: false,
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
