import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix chunk loading issues
  webpack: (config, { isServer }) => {
    // Optimize chunk splitting
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          chunks: 'all',
          maxSize: 244000,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            solana: {
              test: /[\\/]node_modules[\\/]@solana[\\/]/,
              name: 'solana',
              chunks: 'all',
              priority: 20,
            },
            firebase: {
              test: /[\\/]node_modules[\\/]firebase[\\/]/,
              name: 'firebase',
              chunks: 'all',
              priority: 15,
            },
          },
        },
      };
    }

    return config;
  },

  // Experimental features to improve performance
  experimental: {
    optimizePackageImports: ['@solana/wallet-adapter-react', '@solana/wallet-adapter-react-ui'],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Reduce bundle size
  images: {
    unoptimized: false,
  },

  // Disable Turbopack for builds with custom webpack config
  // @ts-ignore - turbopack option is available in Next 15+ but types might lag
  turbopack: {},
};

export default nextConfig;
