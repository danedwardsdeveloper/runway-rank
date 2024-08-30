import express, { Request, Response } from 'express';
import {
	createProxyMiddleware,
	RequestHandler,
	Options,
} from 'http-proxy-middleware';
import { environment } from './environment';

const app = express();

const backendTarget = environment.isProduction
	? environment.PRODUCTION_BACK_END
	: environment.DEVELOPMENT_BACK_END;

const frontendTarget = environment.isProduction
	? environment.PRODUCTION_FRONT_END
	: environment.DEVELOPMENT_FRONT_END;

const options: Options = {
	target: backendTarget,
	changeOrigin: true,
	onProxyRes: (proxyRes, req: Request, res: Response) => {
		proxyRes.headers['Access-Control-Allow-Origin'] = frontendTarget;
		proxyRes.headers['Access-Control-Allow-Methods'] =
			'GET,POST,PUT,DELETE,OPTIONS';
		proxyRes.headers['Access-Control-Allow-Headers'] =
			'Content-Type, Authorization';
	},
};

const apiProxy = createProxyMiddleware(options);

app.use('/api', apiProxy);

app.get('/', (req: Request, res: Response) => {
	res.send('Reverse Proxy Server is running');
});

const port = environment.PORT;
app.listen(port, () => {
	console.log(`Proxy server is running on http://localhost:${port}`);
});
