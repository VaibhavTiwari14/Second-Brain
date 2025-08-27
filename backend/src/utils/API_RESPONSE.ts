import { Response } from 'express';
import { StatusCode } from '../types/STATUS_CODES.types';

class ApiResponse<T = any> {
  statusCode: StatusCode;
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;

  constructor(statusCode: number, data: T | null, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      success: this.success,
      message: this.message,
      data: this.data,
      timestamp: this.timestamp,
    };
  }

  static ok<T>(data: T, message = 'Success'): ApiResponse<T> {
    return new ApiResponse<T>(200, data, message);
  }

  static created<T>(data: T, message = 'Resource created successfully'): ApiResponse<T> {
    return new ApiResponse<T>(201, data, message);
  }

  static accepted<T>(data: T, message = 'Request accepted'): ApiResponse<T> {
    return new ApiResponse<T>(202, data, message);
  }

  static noContent(message = 'No content'): ApiResponse<null> {
    return new ApiResponse<null>(204, null, message);
  }

  static list<T>(
    data: T[],
    message = 'List retrieved successfully',
  ): ApiResponse<{ items: T[]; count: number }> {
    return new ApiResponse<{ items: T[]; count: number }>(
      200,
      {
        items: data,
        count: Array.isArray(data) ? data.length : 0,
      },
      message,
    );
  }

  static sendResponse<T>(res: Response, apiResponse: ApiResponse<T>) {
    return res.status(apiResponse.statusCode).json(apiResponse.toJSON());
  }
}

class SuccessResponse<T> extends ApiResponse<T> {
  constructor(data: T, message = 'Operation successful') {
    super(200, data, message);
  }
}

class CreatedResponse<T> extends ApiResponse<T> {
  constructor(data: T, message = 'Resource created successfully') {
    super(201, data, message);
  }
}

class NoContentResponse extends ApiResponse<null> {
  constructor(message = 'Operation completed successfully') {
    super(204, null, message);
  }
}

export { ApiResponse, CreatedResponse, NoContentResponse, SuccessResponse };
export default ApiResponse;
