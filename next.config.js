/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "uploadthing.com" },
      { hostname: "img.clerk.com" },
    ],
  },
};

module.exports = nextConfig;
