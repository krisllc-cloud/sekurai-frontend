import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Enable if using Railway private networking
  // rewrites: async () => [
  //   {
  //     source: '/api/:path*',
  //     destination: 'http://api-gateway.railway.internal:8000/api/:path*',
  //   },
  // ],
};

export default nextConfig;
