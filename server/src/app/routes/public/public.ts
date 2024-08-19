import express from 'express';

const publicRouter = express.Router();

publicRouter.get('/', (req, res) => {
	res.send('Welcome to the Runway Rank API');
});

export default publicRouter;
