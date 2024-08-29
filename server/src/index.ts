import app from './app/app.js';
import { logger } from './app/middleware/logger.js';
import { validateEnvironment, environment } from './environment.js';

validateEnvironment();
const port: number = environment.PORT;
const apiBase: string = environment.isProduction
	? `${environment.PROXY_SERVER}/api`
	: `http://localhost:${port}/api`;

app.listen(port, () => {
	logger.info(`API available at ${apiBase}`);
});
