import express, { Router } from 'express';

import { validateToken } from '../middleware/jwtToken.js';
import welcome from './publicRoutes/welcome.js';
import createAccount from './publicRoutes/createAccount.js';
import signIn from './publicRoutes/signIn.js';
import topRunways from './publicRoutes/topRunways.js';
import getNextPair from './publicRoutes/getNextPair.js';
import signOut from './publicRoutes/signOut.js';
import { checkTopRunwaysAccess } from '@/app/middleware/checkTopRunwaysAccess.js';

const publicRouter: Router = express.Router();

publicRouter.use('/', welcome, createAccount, signIn, signOut);
publicRouter.use('/', validateToken, getNextPair);
publicRouter.use('/', validateToken, checkTopRunwaysAccess, topRunways);

export default publicRouter;
