import { Request, Response, NextFunction, RequestHandler } from 'express';

const asyncHandler = (requestHandler: RequestHandler): RequestHandler => {
  if (typeof requestHandler !== 'function') {
    throw new TypeError('AsyncHandler expects a function as argument');
  }

  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(requestHandler(req, res, next)).catch((error: any) => {
      if (error && typeof error === 'object') {
        error.path = req.path;
        error.method = req.method;
        error.timestamp = new Date().toISOString();
        if ((req as any).id) {
          error.requestId = (req as any).id;
        }
      }
      next(error);
    });
  };
};

export default asyncHandler;
