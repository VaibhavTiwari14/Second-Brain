import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../../models/user.model'; // Add this import
import ApiError from '../../utils/API_ERROR';
import asyncHandler from '../../utils/asyncHandler';

interface CustomJwtPayload extends JwtPayload {
  id: string;
  username: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
}

const authorizeUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let accessToken: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    accessToken = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    accessToken = req.cookies.accessToken;
  }

  if (!accessToken) {
    throw ApiError.badRequest('Access token is missing. Please log in.');
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string,
    ) as CustomJwtPayload;

    if (!decoded || typeof decoded === 'string') {
      throw ApiError.badRequest('Invalid access token.');
    }

    const userExists = await User.findById(decoded.id).select('_id');

    if (!userExists) {
      throw ApiError.badRequest('User does not exist in Database.');
    }

    req.user = decoded;

    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      throw ApiError.badRequest('Access token has expired. Please refresh your token.');
    }
    throw ApiError.badRequest('Invalid access token.');
  }
});

export default authorizeUser;
