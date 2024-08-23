import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { connectToDatabase } from './database/database.js';
import { corsOptions } from './middleware/cors.js';
import publicRouter from './routes/publicRouter.js';
import protectedRouter from './routes/protectedRouter.js';

const app = express();
connectToDatabase();

app.use(express.static(path.join(__dirname, '../../public')));

app.use(express.json(), cookieParser(), cors(corsOptions));
app.use('/', publicRouter, protectedRouter);

export default app;
