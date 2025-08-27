import mongoose, { Document } from 'mongoose';

export interface ILink extends Document {
  hash: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
