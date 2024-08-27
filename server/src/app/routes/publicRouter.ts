import express, { Router } from 'express';

import { validateToken } from '../middleware/jwtToken.js';
import welcome from './publicRoutes/welcome.js';
import createAccount from './publicRoutes/createAccount.js';
import signIn from './publicRoutes/signIn.js';
import getNextPair from './publicRoutes/getNextPair.js';
import signOut from './publicRoutes/signOut.js';
import images from './publicRoutes/images.js';
import profile from './publicRoutes/profile.js';

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
	profile
);

publicRouter.use('/', (req, res) => {
	res.status(404).json({ message: 'Route not found' });
});

export default publicRouter as Router;
