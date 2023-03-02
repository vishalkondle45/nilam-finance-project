/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    mongodburl:
      "mongodb+srv://nilam:nilam@cluster0.8e1zu7t.mongodb.net/nilam-finance?retryWrites=true&w=majority",
  },
};

module.exports = nextConfig;
