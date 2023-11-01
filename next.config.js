/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: ["uploadthing.com", "img.clerk.com"],
  },
};

module.exports = nextConfig;
