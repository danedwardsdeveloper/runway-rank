const express = require('express');
const pool = require('../pool.js');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const accountsRouter = express.Router();

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

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const result = await pool.query(
			'SELECT id, email, first_name FROM accounts WHERE id = $1',
			[id]
		);
		if (result.rows.length > 0) {
			done(null, result.rows[0]);
		} else {
			done(new Error('User not found'));
		}
	} catch (error) {
		done(error);
	}
});

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
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			return res.status(500).json({ message: 'Internal Server Error' });
		}
		if (!user) {
			return res
				.status(401)
				.json({ message: info.message || 'Invalid username or password' });
		}
		req.logIn(user, (loginErr) => {
			if (loginErr) {
				return res.status(500).json({ message: 'Login error' });
			}
			const userData = {
				userId: user.id,
				email: user.email,
				firstName: user.first_name,
			};
			const sessionCookie = JSON.stringify(userData);

			const maxAge = 60 * 60 * 1000;
			const expiryDate = new Date(Date.now() + maxAge);

			res.cookie('Session', sessionCookie, {
				httpOnly: false,
				secure: false,
				expires: expiryDate,
			});

			req.session.cookie.expires = expiryDate;
			req.session.cookie.maxAge = maxAge;

			return res.json({
				message: 'Login successful!',
				user: userData,
				session: sessionCookie,
			});
		});
	})(req, res, next);
};

const logOut = (req, res) => {
	req.logout((err) => {
		if (err) {
			return res.status(500).send('Logout error');
		}
		res.clearCookie('Session');
		res.send('Logout successful!');
	});
};

// Routes
accountsRouter.post('/accounts/create-account', createAccount);
accountsRouter.post('/accounts/log-in', logIn);
accountsRouter.post('/accounts/log-out', logOut);

module.exports = accountsRouter;
