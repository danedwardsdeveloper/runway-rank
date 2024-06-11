// const { Pool } = require("pg");

// const pool = new Pool({
//   user: "",
//   host: "localhost",
//   database: "RUNWAY_RANK",
//   password: "",
//   port: 5432,
// });

// async function checkUserExists(username) {
//   try {
//     const client = await pool.connect();
//     const result = await client.query("SELECT * FROM Accounts WHERE username = $1", [username]);
//     await client.release();
//     return result.rows.length > 0;
//   } catch (error) {
//     console.error("Error checking user existence:", error);
//     throw error; // Re-throw for handling in route handler
//   }
// }

// module.exports = {
//   checkUserExists,
// };
