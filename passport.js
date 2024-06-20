const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('./pool.js');
const bcrypt = require('bcrypt');

passport.use(
	new LocalStrategy(
		{
			usernameField: 'email', // Set the field name here
		},
		async (email, password, done) => {
			try {
				console.log('Authenticating user:', email); // Log start of authentication
				const result = await pool.query(
					'SELECT * FROM users WHERE email = $1',
					[email]
				);
				const user = result.rows[0];

				if (!user) {
					console.log('User not found:', email); // Log if user is not found
					return done(null, false, {
						message: 'Incorrect email or password.',
					});
				}

				const isMatch = await bcrypt.compare(password, user.password);
				if (!isMatch) {
					console.log('Invalid password for user:', email); // Log if password is incorrect
					return done(null, false, {
						message: 'Incorrect email or password.',
					});
				}

				console.log('Authentication successful for user:', email); // Log successful authentication
				return done(null, user);
			} catch (err) {
				console.error('Error during authentication:', err); // Log any error during the process
				return done(err);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	console.log('Serializing user:', user.id); // Log user serialization
	done(null, user.id); // Serialize the user ID
});

passport.deserializeUser(async (id, done) => {
	try {
		console.log('Deserializing user by ID:', id); // Log user deserialization
		const result = await pool.query('SELECT * FROM accounts WHERE id = $1', [
			id,
		]);
		const user = result.rows[0];
		if (!user) {
			console.log('User not found during deserialization:', id); // Log if user not found during deserialization
			return done(new Error('User not found'));
		}
		done(null, user);
	} catch (err) {
		console.error('Error during deserialization:', err); // Log any error during deserialization
		done(err);
	}
});
