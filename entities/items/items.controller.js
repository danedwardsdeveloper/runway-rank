const pool = require("../../pool.js");

const { calculateWholePairs, calculateEloRating } = require("./utils.js");

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
    const { winnerID, loserID } = req.body;

    if (!winnerID || !loserID) {
      return res.status(400).json({ message: "Request body missing required field(s)" });
    }

    const currentScores = await pool.query(
      `SELECT average_score
   FROM items
   WHERE id IN ($1, $2)`,
      [winnerID, loserID]
    );

    const currentWinnerScore = currentScores.rows[0].average_score;
    const currentLoserScore = currentScores.rows[1].average_score;

    const newWinnerScore = calculateEloRating(currentWinnerScore, currentLoserScore, 1);
    const newLoserScore = calculateEloRating(currentLoserScore, currentWinnerScore, 0);

    const updateWinner = await pool.query(
      `UPDATE items
      SET num_of_ratings = num_of_ratings + 1,
          average_score = $1
      WHERE id = $2`,
      [newWinnerScore, winnerID]
    );

    const updateLoser = await pool.query(
      `UPDATE items
      SET num_of_ratings = num_of_ratings + 1,
          average_score = $1
      WHERE id = $2`,
      [newLoserScore, loserID]
    );

    if (!updateWinner.rowCount && !updateLoser.rowCount) {
      return res.status(404).json({ message: "Items not found" });
    }

    res.json({ message: "Ratings updated successfully" });
  } catch (error) {
    console.error("Error updating ratings:", error);
    return res.status(500).json({ message: "Error posting rating" });
  }
};

const getNextPair = async (req, res) => {
  try {
    let lowestNumOfRatings = 0;
    while (true) {
      const results = await pool.query(`SELECT id, num_of_ratings FROM items WHERE num_of_ratings <= $1`, [lowestNumOfRatings]);

      if (results.rows.length >= 2) {
        res.json(results.rows);
        console.log(results);
        return;
      }
      lowestNumOfRatings++;
    }
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
  getNextPair,
  getTop10,
};
