import { Disclosure, DisclosureButton } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import DesktopMenu from './components/DesktopMenu';
import ProfileMenu from './components/ProfileMenu';
import MobileMenu from './components/MobileMenu';

export default function MenuBar() {
	const mainMenuItems = [
		{ name: 'About', to: '/about' },
		{ name: 'Top runways', to: '/top-runways' },
	];

	const profileMenuItems = [
		{ name: 'Sign in', to: '/sign-in' },
		{ name: 'Create account', to: '/create-account' },
		{ name: 'Sign out', to: '/sign-out' },
		{ name: 'Delete account', to: '/delete-account' },
	];

	return (
		<Disclosure as="nav" className="bg-pink-300 shadow">
			<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
				<div className="relative flex h-16 justify-between">
					<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
						{/* Mobile menu button */}
						<DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
							<span className="absolute -inset-0.5" />
							<span className="sr-only">Open main menu</span>
							<Bars3Icon
								aria-hidden="true"
								className="block h-6 w-6 group-data-[open]:hidden"
							/>
							<XMarkIcon
								aria-hidden="true"
								className="hidden h-6 w-6 group-data-[open]:block"
							/>
						</DisclosureButton>
					</div>
					<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
						<div className="flex flex-shrink-0 items-center">
							<NavLink to="/">
								<img
									alt="Runway Rank"
									src="/favicon.svg"
									className="h-8 w-auto"
								/>
							</NavLink>
						</div>

						<DesktopMenu menuItems={mainMenuItems} />
					</div>
					<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
						<ProfileMenu menuItems={profileMenuItems} />
					</div>
				</div>
			</div>

			<MobileMenu menuItems={mainMenuItems} />
		</Disclosure>
	);
}
