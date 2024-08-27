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
import publicRouter from './routes/publicRouter.js';
import protectedRouter from './routes/protectedRouter.js';
import expressWinston from 'express-winston';
import { logger, expressLogger } from './middleware/logger.js';
import { limiter } from './middleware/limiter.js';
import { validateToken } from './middleware/jwtToken.js';

const app = express();
connectToDatabase();
app.use(expressLogger, helmet()), limiter;
app.use(express.static(path.join(__dirname, '../../public')));

app.use(express.json(), cookieParser(), cors(corsOptions));

app.use(validateToken);
app.use('/', publicRouter, protectedRouter);

app.use(
	expressWinston.errorLogger({
		winstonInstance: logger,
	})
);

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
