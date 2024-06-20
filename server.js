const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();

const itemsRouter = require('./routes/itemsRouter.js');
const accountsRouter = require('./routes/accountsRouter.js');

const app = express();
const port = 3000;

const allowedOrigins = ['http://localhost:8080', 'http://192.168.1.74:8080'];

app.use(
	cors({
		origin: function (origin, callback) {
			if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true,
	})
);

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: true,
			expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
		},
	})
);

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

const path = require('path');
const imagesDir = path.join(__dirname, 'images');
app.use('/images', express.static(imagesDir));

app.use('/api', itemsRouter);
app.use('/api', accountsRouter);

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	console.log('ERROR', error);
	res.json({
		error: {
			message: error.message,
			status: error.status,
		},
	});
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
