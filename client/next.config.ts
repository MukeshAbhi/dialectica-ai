import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: false,
  serverExternalPackages: [],
  outputFileTracingRoot: path.join(__dirname, "../"),
};

export default nextConfig;
