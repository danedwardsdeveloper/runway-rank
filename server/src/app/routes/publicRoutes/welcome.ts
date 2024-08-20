import express, { Router, Request, Response } from 'express';

const welcome: Router = express.Router();

welcome.get('/', (req: Request, res: Response): void => {
	res.send('Welcome to the Runway Rank API');
});

export default welcome;
