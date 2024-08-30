import express, { Request, Response } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { environment } from './environment';
import * as http from 'http';
import errorHandler, {
	notFoundHandler,
	setupUncaughtExceptionHandler,
} from './errorHandler';

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
	pathFilter: '/api',
	logger: console,
	on: {
		proxyReq: (proxyReq, req, res) => {
			console.log(
				`Proxying request to: ${backendTarget}${(req as Request).url}`
			);
		},
		proxyRes: (proxyRes, req, res) => {
			console.log(
				`Received response from: ${backendTarget}${
					(req as Request).url
				}, status: ${proxyRes.statusCode}`
			);
			proxyRes.headers['Access-Control-Allow-Origin'] = frontendTarget;
			proxyRes.headers['Access-Control-Allow-Methods'] =
				'GET,POST,PUT,DELETE,OPTIONS';
			proxyRes.headers['Access-Control-Allow-Headers'] =
				'Content-Type, Authorization';
		},
		error: (err, req, res, target) => {
			console.error('Proxy Error:', err);
			(res as http.ServerResponse).writeHead(500, {
				'Content-Type': 'application/json',
			});
			(res as http.ServerResponse).end(
				JSON.stringify({ error: 'Proxy Error', message: err.message })
			);
		},
	},
};

const apiProxy = createProxyMiddleware(options);

app.use('/', apiProxy);

app.use(errorHandler);
app.use(notFoundHandler);

const port = environment.PORT;
app.listen(port, () => {
	console.log(`Proxy server is running on http://localhost:${port}`);
	console.log(`Backend target: ${backendTarget}`);
	console.log(`Frontend target: ${frontendTarget}`);
});

setupUncaughtExceptionHandler();
