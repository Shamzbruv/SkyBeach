import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Railway does not provide Vinext's optional Cloudflare Images binding.
    // Assets are pre-compressed WebP files, so serve them directly and safely.
    unoptimized: true,
  },
};

export default nextConfig;
