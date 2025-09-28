import { NextRequest } from 'next/server';
import { headers } from 'next/headers';

// Rate limiting configuration
export const RATE_LIMITS = {
  LOGIN: { requests: 5, window: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  REGISTER: { requests: 3, window: 60 * 60 * 1000 }, // 3 attempts per hour
  VERIFICATION: { requests: 2, window: 24 * 60 * 60 * 1000 }, // 2 attempts per day
  GENERAL: { requests: 100, window: 15 * 60 * 1000 }, // 100 requests per 15 minutes
} as const;

// Security headers configuration
export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(self), microphone=(), camera=()',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  //'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
} as const;

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
}

// Password strength validation
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('Password must be at least 8 characters long');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Password must contain lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Password must contain uppercase letters');

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Password must contain numbers');

  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push('Password must contain special characters');

  return {
    isValid: score >= 4,
    score,
    feedback
  };
}

// IP address validation and extraction
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return realIP || cfConnectingIP || '127.0.0.1';
}

// User agent validation
export function isValidUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  
  // Block suspicious user agents
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /php/i
  ];
  
  return !suspiciousPatterns.some(pattern => pattern.test(userAgent));
}

// Session security validation
export function validateSessionSecurity(sessionData: any): boolean {
  if (!sessionData) return false;
  
  const now = Date.now();
  const sessionAge = now - sessionData.createdAt;
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  
  return sessionAge < maxAge;
}

// SQL injection prevention
export function sanitizeSQLInput(input: string): string {
  return input
    .replace(/['"\\]/g, '') // Remove quotes and backslashes
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove block comments start
    .replace(/\*\//g, '') // Remove block comments end
    .replace(/;/g, ''); // Remove semicolons
}

// File upload validation
export function validateFileUpload(file: File): {
  isValid: boolean;
  error?: string;
} {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf'
  ];
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size exceeds 10MB limit' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File type not allowed' };
  }
  
  return { isValid: true };
}

// CSRF token generation and validation
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken && token.length === 64;
}

// Brute force protection
export interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private static instance: RateLimiter;
  private limits: Map<string, RateLimitEntry> = new Map();
  
  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }
  
  isAllowed(key: string, limit: { requests: number; window: number }): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);
    
    if (!entry || now > entry.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + limit.window
      });
      return true;
    }
    
    if (entry.count >= limit.requests) {
      return false;
    }
    
    entry.count++;
    return true;
  }
  
  getRemainingTime(key: string): number {
    const entry = this.limits.get(key);
    if (!entry) return 0;
    
    const now = Date.now();
    return Math.max(0, entry.resetTime - now);
  }
}
