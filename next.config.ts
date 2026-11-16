import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const storageOrigin = supabaseUrl ? new URL(supabaseUrl) : null;

const nextConfig: NextConfig = {
  agentRules: false,
  // Explicitly allow the trusted TV computer's LAN origin for phone testing.
  allowedDevOrigins: ["192.168.1.7"],
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
