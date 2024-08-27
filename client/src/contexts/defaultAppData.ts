import { AppData } from '../../../types';

export const defaultAppData: AppData = {
	message: {
		content: 'Please sign in or create an account to vote',
		colour: 'blue',
	},
	isAuthenticated: false,
	user: null,
	runways: [],
	topRunways: null,
};
