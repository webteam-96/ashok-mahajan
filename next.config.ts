import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',

  /* ============================================================
     301 REDIRECTS
     Preserves SEO from old WordPress URL structure.
     ============================================================ */
  async redirects() {
    return [
      {
        source: "/about/",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/programs/",
        destination: "/speeches",
        permanent: true,
      },
      {
        source: "/category/ashok-mahajan/",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/category/covid-india-task-force/",
        destination: "/covid-india-task-force",
        permanent: true,
      },
      {
        source: "/covid-lifeline/",
        destination: "/covid-lifeline",
        permanent: true,
      },
      {
        source: "/media-support/",
        destination: "/media-support",
        permanent: true,
      },
      {
        source: "/awards/",
        destination: "/awards",
        permanent: true,
      },
      {
        source: "/videos/",
        destination: "/videos",
        permanent: true,
      },
      {
        source: "/publications/",
        destination: "/publications",
        permanent: true,
      },
      {
        source: "/inspirational-quotes/",
        destination: "/gallery",
        permanent: true,
      },
      {
        source: "/gallery/",
        destination: "/messages",
        permanent: true,
      },
    ];
  },

  /* ============================================================
     IMAGE OPTIMISATION — remote patterns
     Add any external image hostname used in next/image here.
     ============================================================ */
  images: {
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

  /* ============================================================
     EXPERIMENTAL FLAGS
     ============================================================ */
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", process.env.NEXTAUTH_URL?.replace(/^https?:\/\//, '') ?? ''].filter(Boolean),
    },
  },
};

export default nextConfig;
