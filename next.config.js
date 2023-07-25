/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    mongodburl: "mongodb+srv://admin:admin@cluster0.r9xhly5.mongodb.net/nilam",
  },
};

module.exports = nextConfig;
