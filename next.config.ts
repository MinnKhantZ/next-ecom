import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow loading images from Unsplash (used by product fixtures)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
