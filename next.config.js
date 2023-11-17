/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['firebasestorage.googleapis.com','lh3.googleusercontent.com'], // Add the domain you want to allow here
  },
};

module.exports = nextConfig;
