import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { finalUserSchema, IUser, zodUserSchema } from '../types/user.type';
import ApiError from '../utils/API_ERROR';
import ApiResponse from '../utils/API_RESPONSE';
import asyncHandler from '../utils/asyncHandler';

const signupUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const schemaResponse = zodUserSchema.safeParse(req.body);

    if (!schemaResponse.success) {
      const errors = schemaResponse.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw ApiError.badRequest('Validation failed', errors);
    }

    const user: finalUserSchema = schemaResponse.data;

    const existingUserId = await User.findOne({ email: user.email }).select('_id');

    if (existingUserId) {
      throw ApiError.conflict('User already exists. Please sign in instead.');
    }

    const createdUser = await User.create(user);

    const userResponse = await User.findById(createdUser._id).select('-password');

    return ApiResponse.sendResponse(
      res,
      ApiResponse.created(userResponse, 'User created successfully.'),
    );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.internal('Failed to create user');
  }
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const schemaResponse = zodUserSchema.safeParse(req.body);
    if (!schemaResponse.success) {
      const errors = schemaResponse.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw ApiError.badRequest('Validation Failed.', errors);
    }
    const { username, password } = schemaResponse.data;
    const existingUser: IUser | null = await User.findOne({ username });

    if (!existingUser) {
      throw ApiError.badRequest("User dosn't exist in database.");
    }

    const isPasswordCorrect: boolean = await existingUser.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      throw ApiError.badRequest('User password is incorrect');
    }

    const accessToken = existingUser.generateAccessToken();
    const refreshToken = await existingUser.generateRefreshToken();

    if (!accessToken || !refreshToken) {
      ApiError.internal('Failed to generate Tokens.');
    }

     res.cookie('refreshToken', refreshToken, {
       httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
       sameSite: 'strict',
       maxAge: 10 * 24 * 60 * 60 * 1000, 
     });

    return ApiResponse.sendResponse(
      res,
      ApiResponse.ok({ accessToken }, 'Login Successfull.'),
    );
  } catch (error: any) {
    throw ApiError.internal('Failed to login user');
  }
});

export { signupUser , loginUser};
