import { DisclosurePanel } from '@headlessui/react';

import { MenuItemsArray } from '../../../../types';
import cleanTailwindClassNames from '../../../utilities/cleanTailwindClassnames';
import { NavLink } from 'react-router-dom';

export default function MobileMenu({ menuItems }: MenuItemsArray) {
	return (
		<DisclosurePanel className="sm:hidden">
			<div className="space-y-1 pb-4 pt-2">
				{menuItems.map((menuItem, index) => (
					<NavLink
						to={menuItem.to}
						key={index}
						className={({ isActive }: { isActive: boolean }) =>
							cleanTailwindClassNames(
								isActive
									? 'bg-indigo-50 border-indigo-500 text-indigo-700'
									: 'text-gray-500 hover:bg-gray-50',
								'block border-l-4 py-2 pl-3 pr-4 text-base font-medium '
							)
						}
					>
						{menuItem.name}
					</NavLink>
				))}
			</div>
		</DisclosurePanel>
	);
}
