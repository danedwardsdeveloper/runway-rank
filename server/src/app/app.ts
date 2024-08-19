import express from 'express';

import publicRouter from './routes/public/public.js';

const app = express();

app.use('/', publicRouter);

export default app;
