import express, { Router, Request, Response } from 'express';

export default express
	.Router()
	.get('/', (req: Request, res: Response): void => {
		res.send('Welcome to the Runway Rank API');
	}) as Router;
