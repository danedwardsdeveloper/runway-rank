const pool = require("../../pool.js");
const bcrypt = require("bcrypt");

const createAccount = async (req, res) => {
  const { email, password, firstName } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  try {
    const result = await pool.query(`SELECT EXISTS(SELECT 1 FROM accounts WHERE email = $1)`, [email]);
    const existingUser = result.rows[0].exists;

    if (existingUser) {
      return res.status(409).json({ message: "Account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAccount = await pool.query(`INSERT INTO accounts (email, password, first_name) VALUES ($1, $2, $3) RETURNING id`, [email, hashedPassword, firstName]);

    const userId = newAccount.rows[0].id;

    req.session.userId = userId;
    req.session.email = email;
    console.log(req.session);

    res.status(201).json({ message: "Account created successfully and logged in" });
  } catch (error) {
    return res.status(500).json({ message: `An error occurred during account creation: ${error}` });
  }
};

// app.post('/login', (req, res) => {
//     if (/* valid credentials */) {
//       req.session.userId = 123;
//       req.session.loggedIn = true;
//       res.status(200).json({ message: 'Login successful' });
//     } else {
//       res.status(401).json({ message: 'Invalid credentials' });
//     }
//   });

// app.get('/logout', (req, res) => {
//     req.session.destroy((err) => {
//       if (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Error logging out' });
//       } else {
//         res.status(200).json({ message: 'Logged out successfully' });
//       }
//     });
//   });

module.exports = {
  createAccount,
};
