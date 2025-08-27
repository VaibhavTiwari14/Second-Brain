import { NextFunction, Request, Response } from 'express';
import ApiError from '../utils/API_ERROR';

const errorHandler = (err: unknown, req: Request, res: Response, _: NextFunction): void => {
  let error: ApiError;

  if (!(err instanceof ApiError)) {
    error = new ApiError(
      (err as any).statusCode || 500,
      (err as any).message || 'Internal Server Error',
    );
  } else {
    error = err;
  }

  const errorResponse = error.toJSON();

  if (process.env.NODE_ENV !== 'production') {
    console.error('🚨 Global Error:', {
      path: req.path,
      method: req.method,
      ...errorResponse,
    });
  }

  res.status(error.statusCode || 500).json(errorResponse);
};

export default errorHandler;
