import express, { Request, Response } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { environment } from './environment';
import * as http from 'http';
import path from 'path';
import errorHandler, {
	notFoundHandler,
	setupUncaughtExceptionHandler,
} from './errorHandler';

const app = express();

const backendTarget = environment.isProduction
	? environment.PRODUCTION_BACK_END
	: `http://localhost:3000`;

const frontendTarget = environment.isProduction
	? environment.PRODUCTION_FRONT_END
	: `http://localhost:5173`;

const apiProxyOptions: Options = {
	target: backendTarget,
	changeOrigin: true,
	secure: false,
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

if (environment.isProduction) {
	app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
} else {
	const frontendProxy = createProxyMiddleware({
		target: frontendTarget,
		changeOrigin: true,
		ws: true,
	});
	app.use('/', frontendProxy);
}

app.use('/api', apiProxy);

app.use((req, res, next) => {
	console.log(`Received ${req.method} request for ${req.url}`);
	next();
});

app.get('*', (req, res) => {
	if (environment.isProduction) {
		res.sendFile(
			path.join(__dirname, '..', '..', 'client', 'dist', 'index.html')
		);
	} else {
		res.redirect('/');
	}
});

app.use(errorHandler);
app.use(notFoundHandler);

const port = environment.PORT;
app.listen(port, () => {
	console.log(`Proxy server is running on http://localhost:${port}`);
	console.log(`Backend target: ${backendTarget}`);
	console.log(`Frontend target: ${frontendTarget}`);
});

setupUncaughtExceptionHandler();
