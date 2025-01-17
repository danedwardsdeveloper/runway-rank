import { NavLink } from 'react-router-dom';
import cleanTailwindClasses from '../../../utilities/cleanTailwindClasses';

import { MenuItemsArray } from '../../../../../types';

export default function DesktopMenu({ menuItems }: MenuItemsArray) {
	return (
		<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
			{menuItems.map((item) => (
				<NavLink
					to={item.to}
					key={item.name}
					className={({ isActive }: { isActive: boolean }) =>
						cleanTailwindClasses(
							isActive
								? 'border-pink-600'
								: 'border-transparent text-white',
							'inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 hover:border-gray-300 hover:bg-pink-500'
						)
					}
				>
					{item.name}
				</NavLink>
			))}
		</div>
	);
}
