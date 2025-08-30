import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import express, { Application } from 'express';

const app: Application = express();

const corsOptions: CorsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

import authorizeUser from './middlewares/auth/auth.middleware';
import errorHandler from './middlewares/globalErrorHandler';
import contentRouter from './routes/content.routes';
import userRouter from './routes/user.routes';
import linkRouter from './routes/link.routes';

app.use('/api/v1/users', userRouter);
app.use('/api/v1/content', authorizeUser, contentRouter);
app.use('/api/v1/brain-link', authorizeUser, linkRouter);


app.use(errorHandler);

export { app };
