import type {NextConfig} from 'next';

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    unoptimized: true,
    domains: ['yummer-next-js-pwa.vercel.app'],
  },
};

module.exports = withPWA(nextConfig);
