import express from 'express';

import { connectToDatabase } from './database/database.js';
import publicRouter from './routes/publicRouter.js';

const app = express();
connectToDatabase();

app.use('/', publicRouter);

export default app;
