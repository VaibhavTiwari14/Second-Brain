import mongoose, { Document } from 'mongoose';

export interface IContent extends Document {
  link: string;
  contentType: 'Youtube' | 'Twitter' | 'Notion-Doc';
  title: string;
  tags: mongoose.Types.ObjectId[];
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
