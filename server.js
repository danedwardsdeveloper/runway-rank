const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
require('./passport');

const itemsRouter = require('./routes/itemsRouter.js');
const accountsRouter = require('./routes/accountsRouter.js');
const ratingsRouter = require('./routes/ratingsRouter.js');

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

app.use(express.json());
app.use(cookieParser());

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: process.env.NODE_ENV === 'production',
			maxAge: 4 * 60 * 60 * 1000, // 4 hours
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());

const path = require('path');
const imagesDir = path.join(__dirname, 'images');
app.use('/images', express.static(imagesDir));

app.use('/api', itemsRouter);
app.use('/api', accountsRouter);
app.use('/api', ratingsRouter);

app.use((err, req, res, next) => {
	console.error('Unhandled error:', err);
	if (!res.headersSent) {
		res.status(500).json({ error: err.message });
	} else {
		console.error('Headers already sent:', err.message);
	}
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
