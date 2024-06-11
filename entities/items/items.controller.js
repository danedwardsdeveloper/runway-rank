const pool = require("../../pool.js");

const { calculateWholePairs } = require("./utils.js");

const getAllItems = async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM items");
    res.json(data);
  } catch (error) {
    console.error("Error fetching items:", error);
    return res.status(500).json({ message: "Error getting items!" });
  }
};

const getTotalPairs = async (req, res) => {
  try {
    let data = await pool.query("SELECT COUNT(*) AS total FROM items");
    let totalCount = data.rows[0].total;
    let wholePairs = calculateWholePairs(totalCount);
    res.json(wholePairs);
  } catch (error) {
    console.error("Error fetching items:", error);
    return res.status(500).json({ message: "Error getting the total number of pairs" });
  }
};

const getPairsRated = async (req, res) => {
  try {
    let data = await pool.query(`SELECT COUNT(*) AS total FROM items WHERE num_of_ratings > 0`);
    let totalCount = data.rows[0].total;
    let wholePairs = calculateWholePairs(totalCount);
    res.json(wholePairs);
  } catch (error) {
    console.error("Error fetching items:", error);
    return res.status(500).json({ message: "Error getting the number of rated pairs" });
  }
};

const postRatings = async (req, res) => {
  try {
    const { winner } = req.body;
    if (!winner) {
      return res.status(400).json({ message: "Request body missing required field(s)" });
    }

    const updateWinner = await pool.query(
      `UPDATE items
      SET num_of_ratings = num_of_ratings + 1,
          average_score = (average_score + 10)
      WHERE id = $1`,
      [winner]
    );

    res.json({ message: "Ratings updated successfully" });
  } catch (error) {
    console.error("Error updating ratings:", error);
    return res.status(500).json({ message: "Error posting rating" });
  }
};

const getNextPair = async (req, res) => {
  try {
  } catch (error) {
    console.error("Error fetching items:", error);
    return res.status(500).json({ message: "Error getting next pair" });
  }
};

const getTop10 = async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM items ORDER BY average_score DESC LIMIT 10");
    res.json(data);
  } catch (error) {
    console.error("Error fetching items:", error);
    return res.status(500).json({ message: "Error getting items." });
  }
};

module.exports = {
  getAllItems,
  getTotalPairs,
  getPairsRated,
  postRatings,
  // getNextPair,
  getTop10,
};
