import express, { Router } from 'express';

import welcome from './publicRoutes/welcome.js';
import topRunways from './publicRoutes/topRunways.js';
import createAccount from './publicRoutes/createAccount.js';

const publicRouter: Router = express.Router();

publicRouter.use('/', welcome, topRunways, createAccount);

export default publicRouter;
