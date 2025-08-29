import mongoose, { Model, Schema } from 'mongoose';
import { IContent } from '../types/content.types';

const urlRegex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

const contentSchema: Schema<IContent> = new mongoose.Schema(
  {
    link: {
      type: String,
      required: true,
      match: urlRegex,
    },
    contentType: {
      type: String,
      enum: ['image', 'video', 'article', 'audio'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tags',
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required : true
    },
  },
  { timestamps: true },
);

export const Content: Model<IContent> = mongoose.model<IContent>('Content', contentSchema);
