const express = require('express');
const pool = require('../pool.js');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { generateToken, verifyToken } = require('./server-auth.js');

const { calculateWholePairs, calculateMinimumPairs } = require('./utils.js');

const accountsRouter = express.Router();

const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.status(401).json({ message: 'Unauthorized' });
	}
};

// Controller functions
const createAccount = async (req, res) => {
	const { email, password, firstName } = req.body;

	if (!email || !email.includes('@')) {
		return res.status(400).json({ message: 'Invalid email format' });
	}

	if (!password || password.length < 6) {
		return res
			.status(400)
			.json({ message: 'Password must be at least 6 characters long' });
	}

	try {
		const result = await pool.query(
			`SELECT EXISTS(SELECT 1 FROM accounts WHERE email = $1)`,
			[email]
		);
		const existingUser = result.rows[0].exists;

		if (existingUser) {
			return res
				.status(409)
				.json({ message: 'An error occurred during account creation' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newAccount = await pool.query(
			`INSERT INTO accounts (email, password, first_name) VALUES ($1, $2, $3) RETURNING id`,
			[email, hashedPassword, firstName]
		);

		const userId = newAccount.rows[0].id;

		req.session.userId = userId;
		req.session.email = email;
		console.log(req.session);

		res.status(201).json({
			message: 'Account created successfully and logged in',
		});
	} catch (error) {
		return res.status(500).json({
			message: `An error occurred during account creation: ${error}`,
		});
	}
};

// passport.serializeUser((user, done) => {
// 	done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
// 	try {
// 		const result = await pool.query(
// 			'SELECT id, email, first_name FROM accounts WHERE id = $1',
// 			[id]
// 		);
// 		if (result.rows.length > 0) {
// 			done(null, result.rows[0]);
// 		} else {
// 			done(new Error('User not found'));
// 		}
// 	} catch (error) {
// 		done(error);
// 	}
// });

passport.use(
	new LocalStrategy(
		{ usernameField: 'email' },
		async (email, password, done) => {
			try {
				const result = await pool.query(
					'SELECT * FROM accounts WHERE email = $1',
					[email]
				);
				if (result.rows.length === 0) {
					return done(null, false, {
						message: 'Incorrect email or password',
					});
				}

				const user = result.rows[0];

				const isMatch = await bcrypt.compare(password, user.password);
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, {
						message: 'Incorrect email or password',
					});
				}
			} catch (error) {
				return done(error);
			}
		}
	)
);

const logIn = (req, res, next) => {
	console.log('Starting login process'); // Log start of the login process

	passport.authenticate('local', (err, user, info) => {
		if (err) {
			console.error('Passport authentication error:', err); // Log any authentication error
			return res.status(500).json({ message: 'Internal Server Error' });
		}
		if (!user) {
			console.log('User not found or invalid credentials:', info); // Log when user is not found or invalid credentials
			return res
				.status(401)
				.json({ message: info.message || 'Invalid username or password' });
		}

		req.logIn(user, (loginErr) => {
			if (loginErr) {
				console.error('req.logIn error:', loginErr); // Log any error during req.logIn
				return res.status(500).json({ message: 'Login error' });
			}

			console.log('User logged in successfully:', user); // Log successful login
			const token = generateToken(user);
			console.log('Generated JWT token:', token); // Log the generated token

			res.cookie('Session', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 4 * 60 * 60 * 1000, // 4 hours
			});

			console.log('Sending response with user info and token');
			return res.json({
				message: 'Login successful!',
				user: {
					userId: user.id,
					email: user.email,
					firstName: user.first_name,
				},
				token,
			});
		});
	})(req, res, next);
};

const logOut = (req, res) => {
	console.log('Logout route called');
	req.logout((err) => {
		if (err) {
			return res.status(500).send('Logout error');
		}
		res.clearCookie('Session');
		res.status(200).send('Logout successful!');
	});
};

const getNextPair = async (req, res) => {
	try {
		const userID = req.body.userID;
		console.log(`Req body: ${userID}`);

		const query = `
            SELECT items.id, items.name, items.subtitle, items.num_of_ratings, items.image_path,
                   COALESCE(ratings.num_of_ratings, 0) AS user_num_of_ratings
            FROM items
            LEFT JOIN (
                SELECT item_id, COUNT(*) AS num_of_ratings
                FROM ratings
                WHERE rated_by = $1
                GROUP BY item_id
            ) AS ratings
            ON items.id = ratings.item_id
            ORDER BY user_num_of_ratings ASC, items.num_of_ratings ASC
            LIMIT 2;
        `;

		const result = await pool.query(query, [userID]);

		if (result.rows.length < 2) {
			return res.status(404).json({ message: 'Not enough items found' });
		}

		const items = result.rows.map((item) => ({
			...item,
			image_path: `/images/${item.image_path}`,
		}));

		res.json(items);
	} catch (error) {
		console.error('Error fetching items:', error);
		return res.status(500).json({ message: 'Error fetching items' });
	}
};

const getPairsRated = async (req, res) => {
	const { userID } = req.body;

	if (!userID) {
		return res.status(400).json({ message: 'User ID is required' });
	}

	try {
		const data = await pool.query(
			`SELECT COUNT(*) AS total 
             FROM ratings 
             WHERE rated_by = $1 
               AND num_of_ratings > 0`,
			[userID]
		);

		const totalCount = data.rows[0].total;
		const pairsRated = calculateMinimumPairs(totalCount);
		res.json({ pairsRated: pairsRated });
	} catch (error) {
		console.error('Error fetching ratings:', error);
		return res
			.status(500)
			.json({ message: 'Error getting the number of rated items' });
	}
};

// Routes
accountsRouter.post('/accounts/log-in', logIn);
accountsRouter.post('/accounts/create-account', createAccount);
accountsRouter.post('/accounts/log-out', logOut);
accountsRouter.post('/accounts/pairs-rated', getPairsRated);

accountsRouter.post('/accounts/next-pair', getNextPair);
// accountsRouter.post('/accounts/next-pair', isAuthenticated, getNextPair);

module.exports = accountsRouter;
