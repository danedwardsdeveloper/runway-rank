import { AppData } from '../../../../types.js';

const appData: AppData = {
	message: {
		content: 'This is the message',
		colour: 'blue',
	},
	isAuthenticated: true,
	user: {
		name: 'Dan',
		email: 'email@gmail.com',
		id: '123456789',
		accessTopRunways: true,
		runwaysUntilAccess: 6,
	},
	runways: [],
	topRunways: [],
};
