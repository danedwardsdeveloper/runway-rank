import express, { Router } from 'express';

import { validateToken } from '../middleware/jwtToken.js';
import welcome from './publicRoutes/welcome.js';
import createAccount from './publicRoutes/createAccount.js';
import signIn from './publicRoutes/signIn.js';
import topRunways from './publicRoutes/topRunways.js';
import getNextPair from './publicRoutes/getNextPair.js';
import signOut from './publicRoutes/signOut.js';

const publicRouter: Router = express.Router();

publicRouter.use(validateToken);
publicRouter.use(
	'/',
	welcome,
	createAccount,
	signIn,
	signOut,
	getNextPair,
	topRunways
);

export default publicRouter as Router;
