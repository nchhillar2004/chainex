import { NextRequest } from 'next/server';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  userId?: number;
  ip?: string;
  userAgent?: string;
  requestId?: string;
}

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context, userId, ip, userAgent, requestId } = entry;
    
    const logObject = {
      timestamp,
      level,
      message,
      ...(context && { context }),
      ...(userId && { userId }),
      ...(ip && { ip }),
      ...(userAgent && { userAgent }),
      ...(requestId && { requestId }),
    };

    return JSON.stringify(logObject);
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, request?: NextRequest, userId?: number): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      userId,
      ip: request ? this.getClientIP(request) : undefined,
      userAgent: request?.headers.get('user-agent') || undefined,
      requestId: request?.headers.get('x-request-id') || undefined,
    };

    const formattedLog = this.formatLog(entry);

    // In development, use console with colors
    if (this.isDevelopment) {
      const colors = {
        [LogLevel.ERROR]: '\x1b[31m', // Red
        [LogLevel.WARN]: '\x1b[33m',  // Yellow
        [LogLevel.INFO]: '\x1b[36m',  // Cyan
        [LogLevel.DEBUG]: '\x1b[37m', // White
      };
      const reset = '\x1b[0m';
      
      console.log(`${colors[level]}[${level.toUpperCase()}]${reset} ${formattedLog}`);
    } else {
      // In production, use structured logging
      console.log(formattedLog);
    }

    // TODO: In production, send to external logging service (e.g., DataDog, LogRocket, etc.)
  }

  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    return realIP || cfConnectingIP || '127.0.0.1';
  }

  error(message: string, context?: Record<string, any>, request?: NextRequest, userId?: number): void {
    this.log(LogLevel.ERROR, message, context, request, userId);
  }

  warn(message: string, context?: Record<string, any>, request?: NextRequest, userId?: number): void {
    this.log(LogLevel.WARN, message, context, request, userId);
  }

  info(message: string, context?: Record<string, any>, request?: NextRequest, userId?: number): void {
    this.log(LogLevel.INFO, message, context, request, userId);
  }

  debug(message: string, context?: Record<string, any>, request?: NextRequest, userId?: number): void {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, context, request, userId);
    }
  }

  // Security-specific logging methods
  securityViolation(message: string, context?: Record<string, any>, request?: NextRequest, userId?: number): void {
    this.error(`SECURITY VIOLATION: ${message}`, {
      ...context,
      securityEvent: true,
      severity: 'high',
    }, request, userId);
  }

  authenticationAttempt(message: string, context?: Record<string, any>, request?: NextRequest, userId?: number): void {
    this.info(`AUTH ATTEMPT: ${message}`, {
      ...context,
      authEvent: true,
    }, request, userId);
  }

  rateLimitExceeded(message: string, context?: Record<string, any>, request?: NextRequest, userId?: number): void {
    this.warn(`RATE LIMIT EXCEEDED: ${message}`, {
      ...context,
      rateLimitEvent: true,
    }, request, userId);
  }

  // Performance logging
  performanceMetric(operation: string, duration: number, context?: Record<string, any>, request?: NextRequest): void {
    this.info(`PERFORMANCE: ${operation}`, {
      ...context,
      performanceEvent: true,
      duration,
      operation,
    }, request);
  }

  // Database operation logging
  databaseOperation(operation: string, table: string, duration?: number, context?: Record<string, any>, request?: NextRequest): void {
    this.debug(`DB OPERATION: ${operation} on ${table}`, {
      ...context,
      dbEvent: true,
      operation,
      table,
      ...(duration && { duration }),
    }, request);
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Convenience functions for common logging patterns
export const logError = (message: string, error?: Error, context?: Record<string, any>, request?: NextRequest, userId?: number) => {
  logger.error(message, {
    ...context,
    error: error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : undefined,
  }, request, userId);
};

export const logSecurityViolation = (message: string, context?: Record<string, any>, request?: NextRequest, userId?: number) => {
  logger.securityViolation(message, context, request, userId);
};

export const logPerformance = (operation: string, duration: number, context?: Record<string, any>, request?: NextRequest) => {
  logger.performanceMetric(operation, duration, context, request);
};
