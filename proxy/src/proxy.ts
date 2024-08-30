import express, { NextFunction, Request, Response } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';

import * as http from 'http';
import path from 'path';

import errorHandler, {
	notFoundHandler,
	setupUncaughtExceptionHandler,
} from './errorHandler';
import {
	backendTarget,
	frontendTarget,
	port,
	isProduction,
} from './environment';

const app = express();

const apiProxyOptions: Options = {
	target: backendTarget,
	changeOrigin: true,
	secure: false,
	pathRewrite: {
		'^/api': '/api',
	},
	logger: console,
	on: {
		proxyReq: (proxyReq, req, res) => {
			console.log(
				`Proxying ${req.method} request to: ${backendTarget}${req.url}`
			);
		},
		proxyRes: (proxyRes, req, res) => {
			console.log(`Received response from backend: ${proxyRes.statusCode}`);
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

const apiProxy = createProxyMiddleware(apiProxyOptions);

app.use('/api', (req: Request, res: Response, next: NextFunction) => {
	console.log(
		`[API Proxy] Forwarding ${req.method} request to ${backendTarget}${req.url}`
	);
	next();
});

app.use('/api', apiProxy);

if (isProduction) {
	app.use(express.static(path.join(__dirname, 'client-dist')));
} else {
	const frontendProxy = createProxyMiddleware({
		target: frontendTarget,
		changeOrigin: true,
		ws: true,
	});
	app.use('/', frontendProxy);
}

app.use((req: Request, res: Response, next: NextFunction) => {
	console.log(`Received ${req.method} request for ${req.url}`);
	next();
});

app.get('*', (req: Request, res: Response) => {
	if (isProduction) {
		res.sendFile(path.join(__dirname, 'client-dist', 'index.html'));
	} else {
		res.redirect('/');
	}
});

app.use(errorHandler);
app.use(notFoundHandler);

app.listen(port, () => {
	console.log(`Proxy server is running on http://localhost:${port}`);
	console.log(`Backend target: ${backendTarget}`);
	console.log(`Frontend target: ${frontendTarget}`);
});

setupUncaughtExceptionHandler();
