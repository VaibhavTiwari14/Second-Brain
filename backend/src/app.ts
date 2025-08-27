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

export { app };
