import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose, { Model, Schema } from 'mongoose';
import { IUser } from '../types/user.type';

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [4, 'Username must be at least 4 characters'],
      maxlength: [10, 'Username must not exceed 10 characters'],
    },      

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [4, 'Password must be at least 4 characters'],
      maxlength: [10, 'Password must not exceed 10 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    throw new Error('ACCESS_TOKEN_SECRET is required');
  }

  const payload: {
    id: string;
    username: string;
    email: string;
  } = {
    id: String(this._id),
    username: this.username,
    email: this.email,
  };

  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

userSchema.methods.generateRefreshToken = async function (): Promise<string> {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) throw new Error('REFRESH_TOKEN_SECRET is required');

  const payload = { id: String(this._id) };

  const refreshToken = jwt.sign(payload, secret, { expiresIn: '10d' });

  this.refreshToken = refreshToken;

  await this.save();
  return refreshToken; 
};

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
