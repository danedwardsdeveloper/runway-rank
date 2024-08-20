import app from './app/app.js';

import { validateEnvironment, environment } from './environment.js';
validateEnvironment();

const port: number = environment.PORT;

app.listen(port, () => {
	environment.isDevelopment &&
		console.log(`API available at http://localhost:${port}`);
});
