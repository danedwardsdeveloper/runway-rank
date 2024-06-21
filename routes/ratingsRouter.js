const express = require('express');
const pool = require('../pool.js');
const { calculateWholePairs, calculateEloRating } = require('./utils.js');

const ratingsRouter = express.Router();

const postRatings = async (req, res) => {
	try {
		const { winnerID, loserID, userID } = req.body;

		if (!winnerID || !loserID || !userID) {
			return res
				.status(400)
				.json({ message: 'Request body missing required field(s)' });
		}

		const currentScores = await pool.query(
			`SELECT average_score
       FROM items
       WHERE id IN ($1, $2)`,
			[winnerID, loserID]
		);

		const currentWinnerScore = currentScores.rows[0].average_score;
		const currentLoserScore = currentScores.rows[1].average_score;

		const newWinnerScore = calculateEloRating(
			currentWinnerScore,
			currentLoserScore,
			1
		);
		const newLoserScore = calculateEloRating(
			currentLoserScore,
			currentWinnerScore,
			0
		);

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
			return res.status(404).json({ message: 'Items not found' });
		}

		const updateRatings = async (itemID) => {
			const ratingExists = await pool.query(
				`SELECT num_of_ratings
                 FROM ratings
                 WHERE rated_by = $1 AND item_id = $2`,
				[userID, itemID]
			);

			if (ratingExists.rowCount > 0) {
				// Update existing rating
				await pool.query(
					`UPDATE ratings
                     SET num_of_ratings = num_of_ratings + 1
                     WHERE rated_by = $1 AND item_id = $2`,
					[userID, itemID]
				);
			} else {
				// Insert new rating
				await pool.query(
					`INSERT INTO ratings (rated_by, item_id, num_of_ratings)
                     VALUES ($1, $2, 1)`,
					[userID, itemID]
				);
			}
		};

		await updateRatings(winnerID);
		await updateRatings(loserID);

		res.json({ message: 'Ratings updated successfully' });
	} catch (error) {
		console.error('Error updating ratings:', error);
		return res.status(500).json({ message: 'Error posting rating' });
	}
};

ratingsRouter.post('/ratings/post-ratings', postRatings);

module.exports = ratingsRouter;
