import express, { Router } from 'express';

import protectedRoute from './protectedRoutes/protectedRoute.js';
import postRankings from './protectedRoutes/postRankings.js';

const protectedRouter: Router = express.Router();

protectedRouter.use('/', protectedRoute, postRankings);

export default protectedRouter;
