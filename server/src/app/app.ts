import express from 'express';
import cookieParser from 'cookie-parser';

import { connectToDatabase } from './database/database.js';
import publicRouter from './routes/publicRouter.js';
import protectedRouter from './routes/protectedRouter.js';

const app = express();
connectToDatabase();

app.use(express.json(), cookieParser());
app.use('/', publicRouter, protectedRouter);

export default app;
