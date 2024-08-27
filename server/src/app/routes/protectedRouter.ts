import express, { Router } from 'express';

import protectedRoute from './protectedRoutes/protectedRoute.js';
import deleteAccount from './protectedRoutes/deleteAccount.js';

const protectedRouter: Router = express.Router();

protectedRouter.use('/accounts', deleteAccount);

export default protectedRouter as Router;
