import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Multipart con imagen ya comprimida en cliente (~1 MB) + resto de campos.
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
