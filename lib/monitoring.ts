import { logger } from './logger';

export interface PerformanceMetrics {
  operation: string;
  duration: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface SystemMetrics {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
  };
  uptime: number;
  timestamp: string;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private readonly maxMetrics = 1000;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  recordMetric(operation: string, duration: number, metadata?: Record<string, any>): void {
    const metric: PerformanceMetrics = {
      operation,
      duration,
      timestamp: new Date().toISOString(),
      metadata,
    };

    this.metrics.push(metric);

    // Keep only the most recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log slow operations
    if (duration > 1000) { // More than 1 second
      logger.warn('Slow operation detected', {
        operation,
        duration,
        metadata,
      });
    }

    // Log performance metrics
    logger.performanceMetric(operation, duration, metadata);
  }

  getMetrics(operation?: string): PerformanceMetrics[] {
    if (operation) {
      return this.metrics.filter(m => m.operation === operation);
    }
    return [...this.metrics];
  }

  getAverageDuration(operation: string): number {
    const operationMetrics = this.getMetrics(operation);
    if (operationMetrics.length === 0) return 0;
    
    const totalDuration = operationMetrics.reduce((sum, metric) => sum + metric.duration, 0);
    return totalDuration / operationMetrics.length;
  }

  getSlowestOperations(limit: number = 10): PerformanceMetrics[] {
    return [...this.metrics]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  clearMetrics(): void {
    this.metrics = [];
  }
}

export class SystemMonitor {
  private static instance: SystemMonitor;
  private metrics: SystemMetrics[] = [];
  private readonly maxMetrics = 100;

  static getInstance(): SystemMonitor {
    if (!SystemMonitor.instance) {
      SystemMonitor.instance = new SystemMonitor();
    }
    return SystemMonitor.instance;
  }

  async collectMetrics(): Promise<SystemMetrics> {
    const memoryUsage = process.memoryUsage();
    const totalMemory = require('os').totalmem();
    const freeMemory = require('os').freemem();
    const usedMemory = totalMemory - freeMemory;

    const metrics: SystemMetrics = {
      memory: {
        used: Math.round(usedMemory / 1024 / 1024), // MB
        total: Math.round(totalMemory / 1024 / 1024), // MB
        percentage: Math.round((usedMemory / totalMemory) * 100),
      },
      cpu: {
        usage: await this.getCpuUsage(),
      },
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };

    this.metrics.push(metrics);

    // Keep only the most recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log system warnings
    if (metrics.memory.percentage > 90) {
      logger.warn('High memory usage detected', {
        memoryPercentage: metrics.memory.percentage,
        usedMemory: metrics.memory.used,
        totalMemory: metrics.memory.total,
      });
    }

    if (metrics.cpu.usage > 90) {
      logger.warn('High CPU usage detected', {
        cpuUsage: metrics.cpu.usage,
      });
    }

    return metrics;
  }

  private async getCpuUsage(): Promise<number> {
    return new Promise((resolve) => {
      const startMeasure = process.cpuUsage();
      
      setTimeout(() => {
        const endMeasure = process.cpuUsage(startMeasure);
        const totalUsage = endMeasure.user + endMeasure.system;
        const totalTime = 1000000; // 1 second in microseconds
        const usage = (totalUsage / totalTime) * 100;
        
        resolve(Math.round(usage));
      }, 1000);
    });
  }

  getMetrics(): SystemMetrics[] {
    return [...this.metrics];
  }

  getLatestMetrics(): SystemMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
  }

  clearMetrics(): void {
    this.metrics = [];
  }
}

// Health check utilities
export class HealthChecker {
  static async checkDatabase(): Promise<{ status: 'healthy' | 'unhealthy'; details: any }> {
    try {
      const prisma = (await import('./db')).default;
      await prisma.$queryRaw`SELECT 1`;
      
      return {
        status: 'healthy',
        details: { message: 'Database connection successful' },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: { error: (error as Error).message },
      };
    }
  }

  static async checkRedis(): Promise<{ status: 'healthy' | 'unhealthy'; details: any }> {
    try {
      const { redis } = await import('./redis');
      await redis.ping();
      
      return {
        status: 'healthy',
        details: { message: 'Redis connection successful' },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: { error: (error as Error).message },
      };
    }
  }

  static async checkAllServices(): Promise<{
    status: 'healthy' | 'unhealthy';
    services: Record<string, { status: 'healthy' | 'unhealthy'; details: any }>;
  }> {
    const [database, redis] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
    ]);

    const services = {
      database,
      redis,
    };

    const allHealthy = Object.values(services).every(service => service.status === 'healthy');

    return {
      status: allHealthy ? 'healthy' : 'unhealthy',
      services,
    };
  }
}

// Performance decorator for functions
export function measurePerformance(operationName: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      
      try {
        const result = await method.apply(this, args);
        const duration = Date.now() - startTime;
        
        PerformanceMonitor.getInstance().recordMetric(operationName, duration, {
          method: propertyName,
          args: args.length,
        });
        
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        
        PerformanceMonitor.getInstance().recordMetric(operationName, duration, {
          method: propertyName,
          error: true,
          errorMessage: (error as Error).message,
        });
        
        throw error;
      }
    };

    return descriptor;
  };
}

// API endpoint performance wrapper
export function withPerformanceMonitoring<T extends any[], R>(
  operationName: string,
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now();
    
    try {
      const result = await fn(...args);
      const duration = Date.now() - startTime;
      
      PerformanceMonitor.getInstance().recordMetric(operationName, duration, {
        success: true,
        args: args.length,
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      PerformanceMonitor.getInstance().recordMetric(operationName, duration, {
        success: false,
        error: true,
        errorMessage: (error as Error).message,
        args: args.length,
      });
      
      throw error;
    }
  };
}

// Export singleton instances
export const performanceMonitor = PerformanceMonitor.getInstance();
export const systemMonitor = SystemMonitor.getInstance();
