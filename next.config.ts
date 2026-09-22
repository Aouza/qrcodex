import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const storageOrigin = supabaseUrl ? new URL(supabaseUrl) : null;

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    remotePatterns: storageOrigin
      ? [{
          protocol: storageOrigin.protocol === "https:" ? "https" : "http",
          hostname: storageOrigin.hostname,
          port: storageOrigin.port,
          pathname: "/storage/v1/object/**",
        }]
      : [],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
