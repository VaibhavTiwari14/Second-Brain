import { StatusCode } from "../types/STATUS_CODES.types";


class ApiError extends Error {
  statusCode: StatusCode;
  success: boolean;
  errors: any[];
  data: any;
  isOperational: boolean;
  timestamp: string;
  statusText: string;

  constructor(
    statusCode: StatusCode,
    message = 'Something went wrong',
    errors: any[] = [],
    isOperational = true,
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.message = message;
    this.errors = Array.isArray(errors) ? errors : [errors];
    this.success = false;
    this.data = null;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
    this.statusText = this.getStatusText(statusCode);
  }

  private getStatusText(statusCode: StatusCode): string {
    const statusTexts: Record<StatusCode, string> = {
      200: 'OK',
      201: 'Created',
      202: 'Accepted',
      204: 'No Content',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
    };
    return statusTexts[statusCode] || 'Unknown Status';
  }

  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      statusText: this.statusText,
      message: this.message,
      errors: this.errors,
      data: this.data,
      timestamp: this.timestamp,
      ...(process.env.NODE_ENV === 'development' && { stack: this.stack }),
    };
  }

  static badRequest(message = 'Bad Request', errors: any[] = []) {
    return new ApiError(400, message, errors);
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, message);
  }

  static conflict(message = "conflict of data"){
    return new ApiError(409,message);
  }
}

export default ApiError;
