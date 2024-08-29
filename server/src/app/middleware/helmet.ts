import helmet from 'helmet';

export const helmetConfig = helmet({
	crossOriginResourcePolicy: { policy: 'cross-origin' },
	contentSecurityPolicy: {
		directives: {
			...helmet.contentSecurityPolicy.getDefaultDirectives(),
			'img-src': ["'self'", 'data:', 'blob:'],
		},
	},
});
