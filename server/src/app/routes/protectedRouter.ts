import express, { Router } from 'express';

import protectedRoute from './protectedRoutes/protectedRoute.js';
import deleteAccount from './protectedRoutes/deleteAccount.js';
import { validateToken } from '../middleware/jwtToken.js';

const protectedRouter: Router = express.Router();

protectedRouter.use('/', validateToken, protectedRoute, deleteAccount);

export default protectedRouter as Router;
