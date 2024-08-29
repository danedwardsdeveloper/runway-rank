import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { environment } from '../environment';
import { AppData } from '../../../types';
import DeleteButton from './DeleteButton';
import Spinner from './Spinner';
import ErrorElement from './ErrorElement';

export default function Profile() {
	const [appData, setAppData] = useState<AppData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProfileData = async () => {
			try {
				const response = await axios.get(`${environment.apiBase}/profile`, {
					withCredentials: true,
				});
				setAppData(response.data);
				setLoading(false);
			} catch (error) {
				if (error instanceof Error) {
					setError(error.message);
				} else {
					setError('An unknown error occurred');
				}
				setLoading(false);
			}
		};

		fetchProfileData();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<h1 className="text-lg mr-2">Loading...</h1>
				<Spinner />
			</div>
		);
	}

	if (error) {
		<ErrorElement error={error} />;
	}

	if (!appData?.isAuthenticated) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
				<h1 className="text-2xl font-bold mb-4 text-gray-900">
					Welcome to Runway Rank
				</h1>
				<p className="text-gray-600 mb-6">
					Please sign in or create an account to continue
				</p>
				<div className="space-x-4">
					<Link
						to="/sign-in"
						className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-500 transition duration-300"
					>
						Sign In
					</Link>
					<Link
						to="/create-account"
						className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300"
					>
						Create Account
					</Link>
				</div>
			</div>
		);
	}

	const { name, email, accessTopRunways, runwaysUntilAccess } =
		appData.user ?? {};

	return (
		<div className="overflow-hidden bg-white shadow md:rounded-lg md:w-2/3 lg:max-w-1/3 mx-auto md:my-5">
			<div className="px-4 py-6 sm:px-6">
				<h3 className="text-base font-semibold leading-7 text-gray-900">
					Profile
				</h3>
				<p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
					Account details.
				</p>
			</div>
			<div className="border-t border-gray-100">
				<dl className="divide-y divide-gray-100">
					<div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className="text-sm font-medium text-gray-900">Name</dt>
						<dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
							{name}
						</dd>
					</div>
					<div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className="text-sm font-medium text-gray-900">
							Email address
						</dt>
						<dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
							{email}
						</dd>
					</div>
					<div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className="text-sm font-medium text-gray-900">
							Access top runways?
						</dt>
						<dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
							{accessTopRunways ? 'Yes' : 'No'}
						</dd>
					</div>
					<div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className="text-sm font-medium text-gray-900">
							Runways to rank until access is granted
						</dt>
						<dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
							{runwaysUntilAccess}
						</dd>
					</div>
					<div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-red-50">
						<dt className="text-sm font-medium text-red-500">
							Delete account
						</dt>
						<dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
							<DeleteButton />
						</dd>
					</div>
					{/* You can add more sections here to display runways or other data */}
				</dl>
			</div>
		</div>
	);
}
