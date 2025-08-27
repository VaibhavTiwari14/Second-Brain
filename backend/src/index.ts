import * as dotenv from 'dotenv';
import { app } from './app';
import { connectDB } from './db/index';

dotenv.config({ path: '.env' });

const PORT: number = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is listening on port: ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
};

startServer();
