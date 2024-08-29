import { NavLink } from 'react-router-dom';
import cleanTailwindClassNames from '../../../utilities/cleanTailwindClassnames';

import { MenuItemsArray } from '../../../../../types';

export default function DesktopMenu({ menuItems }: MenuItemsArray) {
	return (
		<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
			{menuItems.map((item) => (
				<NavLink
					to={item.to}
					key={item.name}
					className={({ isActive }: { isActive: boolean }) =>
						cleanTailwindClassNames(
							isActive
								? 'border-pink-600 text-gray-900'
								: 'border-transparent text-gray-500',
							'inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 hover:border-gray-300 hover:text-gray-700'
						)
					}
				>
					{item.name}
				</NavLink>
			))}
		</div>
	);
}
