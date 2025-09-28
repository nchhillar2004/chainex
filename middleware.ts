import { NextRequest, NextResponse } from "next/server";
import { Config } from "./config/config";
import { SECURITY_HEADERS, RateLimiter, RATE_LIMITS, getClientIP, isValidUserAgent } from '@/lib/security';
import { logger } from '@/lib/logger';

const allowedOrigins = [Config.baseUrl];
const corsOptions = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export function middleware(request: NextRequest) {
    const startTime = Date.now();
    const pathname = request.nextUrl.pathname;
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent');
    const origin = request.headers.get('origin') ?? '';
    const isAllowedOrigin = allowedOrigins.includes(origin);
    const isPreflight = request.method === 'OPTIONS';

    // Security checks
    if (!isValidUserAgent(userAgent)) {
        logger.securityViolation('Invalid user agent detected', {
            userAgent,
            pathname,
            clientIP,
        }, request);
        return new NextResponse('Forbidden', { status: 403 });
    }

    // Rate limiting for API routes
    if (pathname.startsWith('/api/')) {
        const rateLimiter = RateLimiter.getInstance();
        const rateLimitKey = `${clientIP}:${pathname}`;
        
        // Apply different rate limits based on endpoint
        let rateLimit = RATE_LIMITS.GENERAL;
        if (pathname.includes('/auth/login')) {
            rateLimit = RATE_LIMITS.LOGIN;
        } else if (pathname.includes('/auth/register')) {
            rateLimit = RATE_LIMITS.REGISTER;
        } else if (pathname.includes('/auth/verify')) {
            rateLimit = RATE_LIMITS.VERIFICATION;
        }

        if (!rateLimiter.isAllowed(rateLimitKey, rateLimit)) {
            const remainingTime = rateLimiter.getRemainingTime(rateLimitKey);
            logger.rateLimitExceeded('Rate limit exceeded', {
                pathname,
                clientIP,
                remainingTime,
            }, request);
            
            return new NextResponse('Too Many Requests', {
                status: 429,
                headers: {
                    'Retry-After': Math.ceil(remainingTime / 1000).toString(),
                },
            });
        }
    }

    // Handle CORS preflight requests
    if (isPreflight) {
        const preflightHeaders = {
            ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
            ...corsOptions,
            ...SECURITY_HEADERS,
        }
        return NextResponse.json({}, { headers: preflightHeaders });
    }

    // URL path normalization and redirects
    if (pathname === '/c') {
        return NextResponse.redirect(new URL('/c/', request.url));
    }
    
    if (pathname === '/t') {
        return NextResponse.redirect(new URL('/t/', request.url));
    }
    
    if (pathname === '/u') {
        return NextResponse.redirect(new URL('/u/', request.url));
    }

    // Create response with security headers
    const response = NextResponse.next();

    // Apply CORS headers
    if (isAllowedOrigin) response.headers.set('Access-Control-Allow-Origin', origin);
    Object.entries(corsOptions).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    // Apply security headers
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    // Add custom security headers
    response.headers.set('X-Request-ID', crypto.randomUUID());
    response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);

    // Log request
    logger.info('Request processed', {
        method: request.method,
        pathname,
        clientIP,
        userAgent: userAgent?.substring(0, 100), // Truncate for privacy
    }, request);

    return response;
}

export const config = {
    matcher: [
        "/api/:path*",
        "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
    ],
}

