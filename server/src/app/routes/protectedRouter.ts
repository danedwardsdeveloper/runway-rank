import express, { Router } from 'express';

import protectedRoute from './protectedRoutes/protectedRoute.js';
import validateToken from '../middleware/validateToken.js';

const protectedRouter: Router = express.Router();

protectedRouter.use('/', protectedRoute, validateToken);

export default protectedRouter;
