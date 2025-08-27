import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from '../types/user.type';
import bcrypt from 'bcrypt';


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

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
