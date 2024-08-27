import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useApp } from '../contexts/AppContext';
import { logger } from '../utilities/logger';
import Metadata from './Metadata';
import Spinner from './Spinner';
import { AppData } from '../../../types';

export default function SignOutButton() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const { setAppData } = useApp();

	const handleSignOut = async () => {
		setIsLoading(true);
		setError(null);
		setAppData((prevData: AppData) => ({
			...prevData,
			message: { content: '', colour: 'black' },
		}));

		try {
			logger.info('Attempting sign-out');
			const response = await axios.get(`http://localhost:3000/sign-out`, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
				},
			});

			logger.info('Sign-out successful');

			setAppData((prevData: AppData) => ({
				...prevData,
				message: { content: response.data.message, colour: 'green' },
				isAuthenticated: false,
				user: null,
				runways: null,
				topRunways: null,
			}));
			navigate('/');
		} catch (error) {
			logger.error('Sign-out error', { error });
			if (axios.isAxiosError(error)) {
				const errorMessage =
					error.response?.data?.message ||
					error.message ||
					'An error occurred during sign-out.';
				setError(errorMessage);
				setAppData((prevData: AppData) => ({
					...prevData,
					message: {
						content: errorMessage,
						colour: 'red',
					},
				}));
			} else {
				setError('An unexpected error occurred.');
				setAppData((prevData: AppData) => ({
					...prevData,
					message: {
						content: 'An unexpected error occurred.',
						colour: 'red',
					},
				}));
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Metadata pageName="Sign out" slug="sign-out" />

			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<img
						alt="Runway Rank"
						src="/favicon.svg"
						className="mx-auto h-10 w-auto"
					/>
					<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
						Sign out
					</h2>
				</div>
				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					{error && (
						<div className="mb-4 text-red-500 text-center">{error}</div>
					)}
					<button
						onClick={handleSignOut}
						disabled={isLoading}
						className="flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 disabled:opacity-50"
					>
						{isLoading ? <Spinner /> : 'Sign out'}
					</button>
				</div>
			</div>
		</>
	);
}
