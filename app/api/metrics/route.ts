import { NextResponse } from 'next/server';
import { performanceMonitor, systemMonitor } from '@/lib/monitoring';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    // Collect current system metrics
    const systemMetrics = await systemMonitor.collectMetrics();
    
    // Get performance metrics
    const performanceMetrics = performanceMonitor.getMetrics();
    const slowestOperations = performanceMonitor.getSlowestOperations(10);
    
    // Calculate performance statistics
    const performanceStats = {
      totalOperations: performanceMetrics.length,
      averageDuration: performanceMetrics.length > 0 
        ? performanceMetrics.reduce((sum, metric) => sum + metric.duration, 0) / performanceMetrics.length 
        : 0,
      slowestOperations: slowestOperations.map(op => ({
        operation: op.operation,
        duration: op.duration,
        timestamp: op.timestamp,
      })),
    };

    const response = {
      timestamp: new Date().toISOString(),
      system: systemMetrics,
      performance: performanceStats,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV,
    };

    logger.info('Metrics collected', {
      systemMetrics: systemMetrics.memory.percentage,
      performanceOperations: performanceStats.totalOperations,
    });

    return NextResponse.json(response);
  } catch (error) {
    logger.error('Metrics collection failed', { error });
    
    return NextResponse.json(
      {
        error: 'Metrics collection failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
