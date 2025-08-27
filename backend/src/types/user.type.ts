import { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  isPasswordCorrect(password: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}