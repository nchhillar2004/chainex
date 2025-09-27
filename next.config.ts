import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // optimizations
    compress: true,
    poweredByHeader: false,

    images: {
        remotePatterns: 
        process.env.NODE_ENV === "production" ? 
            [
                {
                    protocol: 'https',
                    hostname: '**.vercel.app', // TODO replace with prod hostname
                    port: ''
                }
            ] :
            [
                {
                    protocol: 'http',
                    hostname: 'localhost',
                    port: '3000',
                }
            ]
    },

    // security
    async headers() {
        return [
            {
                source: '/(.*)',
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
                        value: 'origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'geolocation=(self), camera=(), microphone=()',
                    }
                ]
            }
        ]
    },

    // experimental
    experimental: {
        optimizeCss: true
    }
};

export default nextConfig;
