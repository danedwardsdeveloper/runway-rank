import express, {
	Request,
	Response,
	NextFunction,
	ErrorRequestHandler,
} from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { connectToDatabase } from './database/database.js';
import { corsOptions } from './middleware/cors.js';
import { logger, expressLogger } from './middleware/logger.js';
import { limiter } from './middleware/limiter.js';
import { validateToken } from './middleware/jwtToken.js';

import expressWinston from 'express-winston';
import signOut from './router/routes/signOut.js';
import deleteAccount from './router/routes/deleteAccount.js';
import welcome from './router/routes/welcome.js';
import createAccount from './router/routes/createAccount.js';
import signIn from './router/routes/signIn.js';
import getNextPair from './router/routes/getNextPair.js';
import images from './router/routes/images.js';
import profile from './router/routes/profile.js';

const app = express();
connectToDatabase();
app.use(expressLogger, helmet()), limiter;
app.use(express.static(path.join(__dirname, '../../public')));

app.use(express.json(), cookieParser(), cors(corsOptions));

app.use(images);

app.use('/', validateToken, welcome);
app.use('/', validateToken, createAccount);
app.use('/', validateToken, signIn);
app.use('/', validateToken, signOut);
app.use('/', validateToken, getNextPair);
app.use('/', validateToken, profile);

app.use('/sign-out', validateToken, signOut);
app.use('/delete-account', validateToken, deleteAccount);

app.use(
	expressWinston.errorLogger({
		winstonInstance: logger,
	})
);

app.use('/', (req, res) => {
	res.status(404).json({ message: 'Route not found' });
	logger.info(`Unmatched route: ${req.method} ${req.originalUrl}`);
});

const errorHandler: ErrorRequestHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	logger.error(err.stack);
	res.status(500).send('Unknown error!');
};

app.use(errorHandler);

export default app;
