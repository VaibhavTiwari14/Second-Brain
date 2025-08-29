import { Document } from 'mongoose';
import * as z from 'zod';

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  refreshToken : string,
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): Promise<string>;
  createdAt: Date;
  updatedAt: Date;
}

export const zodUserSchema = z.object({
  username: z.string().trim().min(4).max(10),
  password: z.string().trim().min(4).max(10),
  email: z.email().optional(),
});

export type finalUserSchema = z.infer<typeof zodUserSchema>;
