import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    staticPageGenerationTimeout: 60,

    // Production optimizations
    poweredByHeader: false, // Remove X-Powered-By header for security

    // Images configuration
    images: {
        unoptimized: true, // Required for Railway deployment and static export compatibility
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },

    // Environment variables that should be available at build time
    env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    },

    // Output configuration for Railway
    output: 'standalone',

    // Headers for security and PWA support
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
            {
                source: '/sw.js',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, must-revalidate',
                    },
                    {
                        key: 'Service-Worker-Allowed',
                        value: '/',
                    },
                ],
            },
            {
                source: '/manifest.json',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
