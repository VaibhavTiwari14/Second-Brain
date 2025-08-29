import mongoose from 'mongoose';
import { DB_NAME } from '../constants';

export const connectDB = async () => {
  const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}${DB_NAME}`);
  console.log(`Database connected to : ${connectionInstance.connection.host}`);
};
