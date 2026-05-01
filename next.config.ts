import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  ...(isProd && { basePath: "/semantic-code-renderer" }),
};

export default nextConfig;
