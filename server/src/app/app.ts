import express from 'express';
import cookieParser from 'cookie-parser';

import { connectToDatabase } from './database/database.js';
import publicRouter from './routes/publicRouter.js';
import protectedRouter from './routes/protectedRouter.js';
import validateToken from './middleware/validateToken.js';

const app = express();
connectToDatabase();

app.use(express.json());
app.use(cookieParser());

app.use('/', publicRouter);
app.use('/', protectedRouter, validateToken);

export default app;
