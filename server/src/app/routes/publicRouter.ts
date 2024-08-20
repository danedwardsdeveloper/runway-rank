import express, { Router } from 'express';

import welcome from './publicRoutes/welcome.js';
import topRunways from './publicRoutes/topRunways.js';
import createAccount from './publicRoutes/createAccount.js';
import initialData from './publicRoutes/initialData.js';
import signIn from './publicRoutes/signIn.js';
import getNextPair from './publicRoutes/getNextPair.js';

const publicRouter: Router = express.Router();

publicRouter.use(
	'/',
	welcome,
	topRunways,
	createAccount,
	signIn,
	getNextPair,
	initialData
);

export default publicRouter;
