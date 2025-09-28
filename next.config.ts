import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
    // optimizations
    compress: true,
    poweredByHeader: false,

    images: {
        remotePatterns: 
        isProd ? 
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
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "", // TODO add policy: default-src 'self'; script-src 'self';...
                    }
                ]
            }
        ]
    },
};

export default nextConfig;
