function calculateEloRating(myRating, opponentRating, myGameResult) {
	if ([0, 0.5, 1].indexOf(myGameResult) === -1) {
		return null;
	}

	const myChanceToWin =
		1 / (1 + Math.pow(10, (opponentRating - myRating) / 400));
	const ratingDelta = Math.round(32 * (myGameResult - myChanceToWin));

	return myRating + ratingDelta;
}

const calculateMinimumPairs = (items) => {
	return Math.ceil(items / 2);
};

module.exports = {
	calculateEloRating,
	calculateMinimumPairs,
};
