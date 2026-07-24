import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nxqzbgbcarnwmgpiyoge.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Libera upload de logos/fotos maiores que o padrão de 1MB.
      bodySizeLimit: "10mb",
    },
    // Habilita as transições de página (View Transitions API via React).
    viewTransition: true,
  },
};

export default nextConfig;
