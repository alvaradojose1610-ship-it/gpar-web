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
  async redirects() {
    return [
      {
        source: "/automotriz",
        destination: "/carga-pesada",
        permanent: true,
      },
      {
        source: "/automotriz/:path*",
        destination: "/carga-pesada/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
