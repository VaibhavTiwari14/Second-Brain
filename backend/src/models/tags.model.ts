import mongoose, { Model, Schema } from 'mongoose';
import { ITags } from '../types/tags.type';

const tagsSchema : Schema<ITags> = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

export const Tags : Model<ITags> = mongoose.model<ITags>('Tags', tagsSchema);
