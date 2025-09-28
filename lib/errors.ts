import { logger } from './logger';

export enum ErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Database
  DATABASE_ERROR = 'DATABASE_ERROR',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  DUPLICATE_RECORD = 'DUPLICATE_RECORD',
  CONSTRAINT_VIOLATION = 'CONSTRAINT_VIOLATION',
  
  // File Operations
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Business Logic
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
  RESOURCE_EXHAUSTED = 'RESOURCE_EXHAUSTED',
  
  // External Services
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  
  // System
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  MAINTENANCE_MODE = 'MAINTENANCE_MODE',
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, any>;
  public readonly timestamp: string;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message);
    
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;
    this.timestamp = new Date().toISOString();
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      ...(this.context && { context: this.context }),
    };
  }
}

// Specific error classes
export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCode.VALIDATION_ERROR, 400, true, context);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', context?: Record<string, any>) {
    super(message, ErrorCode.UNAUTHORIZED, 401, true, context);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions', context?: Record<string, any>) {
    super(message, ErrorCode.FORBIDDEN, 403, true, context);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource', context?: Record<string, any>) {
    super(`${resource} not found`, ErrorCode.RECORD_NOT_FOUND, 404, true, context);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCode.DUPLICATE_RECORD, 409, true, context);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', context?: Record<string, any>) {
    super(message, ErrorCode.RATE_LIMIT_EXCEEDED, 429, true, context);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, originalError?: Error, context?: Record<string, any>) {
    super(message, ErrorCode.DATABASE_ERROR, 500, false, {
      ...context,
      originalError: originalError?.message,
    });
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string, context?: Record<string, any>) {
    super(`External service error (${service}): ${message}`, ErrorCode.EXTERNAL_SERVICE_ERROR, 502, true, {
      ...context,
      service,
    });
  }
}

// Error handler utility
export class ErrorHandler {
  static handle(error: Error, context?: Record<string, any>): AppError {
    // If it's already an AppError, return it
    if (error instanceof AppError) {
      return error;
    }

    // Handle Prisma errors
    if (error.name === 'PrismaClientKnownRequestError') {
      return this.handlePrismaError(error, context);
    }

    // Handle validation errors
    if (error.name === 'ZodError') {
      return new ValidationError('Invalid input data', {
        ...context,
        validationErrors: (error as any).errors,
      });
    }

    // Handle network errors
    if (error.name === 'FetchError' || error.message.includes('network')) {
      return new ExternalServiceError('Network', error.message, context);
    }

    // Default to internal server error
    return new AppError(
      'An unexpected error occurred',
      ErrorCode.INTERNAL_SERVER_ERROR,
      500,
      false,
      {
        ...context,
        originalError: error.message,
        stack: error.stack,
      }
    );
  }

  private static handlePrismaError(error: any, context?: Record<string, any>): AppError {
    const { code, meta } = error;

    switch (code) {
      case 'P2002':
        return new ConflictError('Resource already exists', {
          ...context,
          field: meta?.target,
        });
      
      case 'P2025':
        return new NotFoundError('Record', context);
      
      case 'P2003':
        return new ValidationError('Invalid reference', {
          ...context,
          field: meta?.field_name,
        });
      
      case 'P2014':
        return new ValidationError('Invalid relation', {
          ...context,
          relation: meta?.relation_name,
        });
      
      default:
        return new DatabaseError('Database operation failed', error, context);
    }
  }

  static async logError(error: AppError, request?: any, userId?: number): Promise<void> {
    const logContext = {
      errorCode: error.code,
      statusCode: error.statusCode,
      isOperational: error.isOperational,
      context: error.context,
      stack: error.stack,
      userId,
    };

    if (error.statusCode >= 500) {
      logger.error(`Server Error: ${error.message}`, logContext, request, userId);
    } else if (error.statusCode >= 400) {
      logger.warn(`Client Error: ${error.message}`, logContext, request, userId);
    } else {
      logger.info(`Application Error: ${error.message}`, logContext, request, userId);
    }
  }
}

// Error response formatter
export function formatErrorResponse(error: AppError, includeStack: boolean = false) {
  const response: any = {
    error: {
      code: error.code,
      message: error.message,
      timestamp: error.timestamp,
    },
  };

  if (includeStack && process.env.NODE_ENV === 'development') {
    response.error.stack = error.stack;
  }

  if (error.context) {
    response.error.context = error.context;
  }

  return response;
}

// Async error wrapper
export function asyncHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      throw ErrorHandler.handle(error as Error);
    }
  };
}

// Error boundary for React components
export function createErrorBoundary(Component: React.ComponentType<any>) {
  return class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error?: AppError }
  > {
    constructor(props: { children: React.ReactNode }) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
      const appError = ErrorHandler.handle(error);
      return { hasError: true, error: appError };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      const appError = ErrorHandler.handle(error, {
        componentStack: errorInfo.componentStack,
      });
      
      ErrorHandler.logError(appError);
    }

    render() {
      if (this.state.hasError) {
        return (
          <div className="error-boundary">
            <h2>Something went wrong</h2>
            <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details>
                <summary>Error Details</summary>
                <pre>{JSON.stringify(this.state.error.toJSON(), null, 2)}</pre>
              </details>
            )}
          </div>
        );
      }

      return this.props.children;
    }
  };
}
