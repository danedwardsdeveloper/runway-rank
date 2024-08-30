import { CorsOptions } from 'cors';

import { environment } from '../../environment.js';

const productionOrigin = environment.ALLOWED_ORIGIN;
const developmentOrigin = 'http://localhost:8080';

export const corsOptions: CorsOptions = {
	origin: environment.isProduction ? productionOrigin : developmentOrigin,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
	credentials: true,
	preflightContinue: false,
	optionsSuccessStatus: 204,
};
