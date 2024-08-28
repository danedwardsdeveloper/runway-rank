import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

import { MenuItemsArray } from '../../../../../types';
import { Link } from 'react-router-dom';

export default function ProfileMenu({ menuItems }: MenuItemsArray) {
	return (
		<Menu as="div" className="relative ml-3">
			<div>
				<MenuButton
					className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
					data-testid="profile-menu-button"
				>
					<span className="absolute -inset-1.5" />
					<span className="sr-only">Open user menu</span>
					<img
						alt=""
						src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
						className="h-8 w-8 rounded-full"
					/>
				</MenuButton>
			</div>
			<MenuItems
				transition
				className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
			>
				{menuItems.map((menuItem, index) => (
					<MenuItem key={index}>
						<Link
							to={menuItem.to}
							data-testid={menuItem.to}
							className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
						>
							{menuItem.name}
						</Link>
					</MenuItem>
				))}
			</MenuItems>
		</Menu>
	);
}
