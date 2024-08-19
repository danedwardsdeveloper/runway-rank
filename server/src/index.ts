import app from './app/app.js';

import { validateEnvironment, environment } from './environment.js';
validateEnvironment();

const port: number = environment.PORT;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
