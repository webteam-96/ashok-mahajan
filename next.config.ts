import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',

  /* ============================================================
     IMAGE OPTIMISATION — remote patterns
     Add any external image hostname used in next/image here.
     ============================================================ */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ashokmahajan.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.ashokmahajan.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ashokmahajan.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.ashokmahajan.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i0.wp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i1.wp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i2.wp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
    ],
  },

};

export default nextConfig;
