import { PairScores } from '@/types.js';

export function calculateEloRatings({
	winnerRating,
	loserRating,
}: PairScores): PairScores {
	const expectedWinProbability =
		1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));

	const winnerRatingChange = Math.round(32 * (1 - expectedWinProbability));
	const loserRatingChange = Math.round(32 * (0 - expectedWinProbability));

	const newWinnerRating = Math.min(
		Math.max(winnerRating + winnerRatingChange, 0),
		10000
	);
	const newLoserRating = Math.min(
		Math.max(loserRating + loserRatingChange, 0),
		10000
	);

	return {
		winnerRating: newWinnerRating,
		loserRating: newLoserRating,
	};
}
