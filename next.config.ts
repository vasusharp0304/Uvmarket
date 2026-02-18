import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    staticPageGenerationTimeout: 60,
    
    // Production optimizations
    poweredByHeader: false, // Remove X-Powered-By header for security
    
    // Images configuration
    images: {
        unoptimized: true, // Required for static export compatibility
    },
    
    // Environment variables that should be available at build time
    env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    },
    
    // Headers for security
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
        ];
    },
};

export default nextConfig;
