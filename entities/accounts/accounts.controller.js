const pool = require("../../pool.js");

const createAccount = async (req, res) => {
  const { email, password, firstName } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  try {
    const result = await client.query(`SELECT EXISTS(SELECT 1 FROM accounts WHERE email = $1)`, [email]);
    const existingUser = result.rows[0].exists;

    if (userExists) {
      return res.status(409).json({ message: "An error occurred while attempting to create the account" });
    }

    const newAccount = await pool.query(
      `INSERT INTO accounts (email, password, first_name)
       VALUES ($1, $2, $3)`,
      [email, password, firstName]
    );

    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred during account creation" });
  }
};

module.exports = {
  createAccount,
};
