const jwt = require('jsonwebtoken');

// Function to generate a JWT token
const generateToken = (user) => {
	return jwt.sign(
		{
			userId: user.id,
			email: user.email,
			firstName: user.first_name,
		},
		process.env.JWT_SECRET,
		{ expiresIn: '4h' }
	); // Set token expiry to 4 hours
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
	const token = req.cookies.Session;
	if (!token) {
		return res.status(401).json({ message: 'No token provided' });
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res
				.status(403)
				.json({ message: 'Failed to authenticate token' });
		}
		req.user = decoded;
		next();
	});
};

module.exports = { generateToken, verifyToken };
