import express, { Router } from 'express';

import { validateToken } from '../middleware/jwtToken.js';
import welcome from './publicRoutes/welcome.js';
import createAccount from './publicRoutes/createAccount.js';
import signIn from './publicRoutes/signIn.js';
import topRunways from './publicRoutes/topRunways.js';
import getNextPair from './publicRoutes/getNextPair.js';
import signOut from './publicRoutes/signOut.js';
import images from './publicRoutes/images.js';

const publicRouter: Router = express.Router();

publicRouter.use(images);
publicRouter.use(
	'/',
	validateToken,
	welcome,
	createAccount,
	signIn,
	signOut,
	getNextPair,
	topRunways
);

export default publicRouter as Router;
