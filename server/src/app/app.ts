import express, {
	Request,
	Response,
	NextFunction,
	ErrorRequestHandler,
} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import expressWinston from 'express-winston';

import { connectToDatabase } from './database/database.js';
import { corsOptions } from './middleware/cors.js';
import { logger, expressLogger } from './middleware/logger.js';
import { limiter } from './middleware/limiter.js';
import { validateToken } from './middleware/jwtToken.js';
import { helmetConfig } from './middleware/helmet.js';

import welcomeRoute from './routes/welcome.js';
import createAccount from './routes/createAccount.js';
import signIn from './routes/signIn.js';
import signOut from './routes/signOut.js';
import deleteAccount from './routes/deleteAccount.js';
import profile from './routes/profile.js';
import getNextPairRoute from './routes/getNextPair.js';
import imageRoute from './routes/image.js';
import imageUploadRoute from './routes/imageUpload.js';
import getQueensRoute from './routes/getQueens.js';
import addQueenRoute from './routes/addQueen.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
connectToDatabase();

app.set('trust proxy', 1);

app.use(expressLogger, limiter);
app.use(helmetConfig);
app.use(express.json(), cookieParser(), cors(corsOptions));

app.use('/api/public', express.static(path.join(__dirname, '../../public')));

const apiRouter = express.Router();

apiRouter.use('/images', imageRoute);
apiRouter.use('/queens', getQueensRoute);
apiRouter.use('/', validateToken, welcomeRoute);
apiRouter.use('/', validateToken, createAccount);
apiRouter.use('/', validateToken, signIn);
apiRouter.use('/', validateToken, signOut);
apiRouter.use('/get-next-pair', validateToken, getNextPairRoute);
apiRouter.use('/', validateToken, profile);
apiRouter.use('/add-queen', validateToken, addQueenRoute);
apiRouter.use('/sign-out', validateToken, signOut);
apiRouter.use('/delete-account', validateToken, deleteAccount);
apiRouter.use('/images/upload', validateToken, imageUploadRoute);

app.use('/', apiRouter);

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
