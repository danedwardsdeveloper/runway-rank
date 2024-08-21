import { UserObject } from '@/types.js';

export default function cleanUserObject(user: any): UserObject {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		accessTopRunways: user.accessTopRunways,
		numRunwaysUntilAccess: user.numRunwaysUntilAccess,
	};
}
