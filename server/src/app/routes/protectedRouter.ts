import express, { Router } from 'express';

import protectedRoute from './protectedRoutes/protectedRoute.js';

const protectedRouter: Router = express.Router();

protectedRouter.use('/', protectedRoute);

export default protectedRouter;
