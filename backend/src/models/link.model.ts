import mongoose, {Schema, Model} from 'mongoose';
import { ILink } from '../types/link.types';

const linkSchema: Schema<ILink> = new mongoose.Schema(
  {
    hash: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export const Link : Model<ILink> = mongoose.model<ILink>('Link', linkSchema);
