import { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@100handy/ui"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ibvohcqwrfnbtyunwprh.supabase.co',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;
