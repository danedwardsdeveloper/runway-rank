const pool = require("../../pool.js");

const getAllItems = async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM items");
    res.json(data);
  } catch (error) {
    console.error("Error fetching items:", error);
    return res.status(500).json({ message: "Error getting items!" });
  }
};

const getTotalItems = async (req, res) => {
  try {
    const data = await pool.query("SELECT COUNT(*) AS total FROM items");
    res.json({ total: data.rows[0].total });
  } catch (error) {
    console.error("Error fetching items:", error);
    return res.status(500).json({ message: "Error getting items!" });
  }
};

const getTop10 = async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM items ORDER BY average_score DESC LIMIT 10");
    res.json(data);
  } catch (error) {
    console.error("Error fetching items:", error);
    return res.status(500).json({ message: "Error getting items!" });
  }
};

module.exports = {
  getAllItems,
  getTotalItems,
  getTop10,
};
