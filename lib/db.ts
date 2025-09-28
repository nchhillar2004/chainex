import { PrismaClient } from "@prisma/client";
import { logger } from './logger';

declare global {
  var prisma: PrismaClient | undefined;
}

// Enhanced Prisma client configuration
const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' },
  ] : [
    { emit: 'event', level: 'error' },
  ],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Log database queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug('Database query executed', {
      query: e.query,
      params: e.params,
      duration: e.duration,
      target: e.target,
    });
  });
}

// Log database errors
prisma.$on('error', (e) => {
  logger.error('Database error occurred', {
    message: e.message,
    target: e.target,
  });
});

// Log database info
prisma.$on('info', (e) => {
  logger.info('Database info', {
    message: e.message,
    target: e.target,
  });
});

// Log database warnings
prisma.$on('warn', (e) => {
  logger.warn('Database warning', {
    message: e.message,
    target: e.target,
  });
});

// Connection health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error('Database connection failed', { error });
    return false;
  }
}

// Graceful shutdown
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection', { error });
  }
}

// Transaction wrapper with retry logic
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        logger.error('Operation failed after all retries', {
          operation: operation.name,
          attempts: maxRetries,
          error: lastError.message,
        });
        throw lastError;
      }
      
      logger.warn('Operation failed, retrying', {
        operation: operation.name,
        attempt,
        maxRetries,
        error: lastError.message,
      });
      
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError!;
}

// Optimized query helper
export class DatabaseOptimizer {
  static async executeWithMetrics<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      const result = await operation();
      const duration = Date.now() - startTime;
      
      logger.performanceMetric(operationName, duration);
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`Database operation failed: ${operationName}`, {
        duration,
        error,
      });
      throw error;
    }
  }
}

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
