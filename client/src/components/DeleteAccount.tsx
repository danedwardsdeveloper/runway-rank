import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { environment } from '../environment';
import { useApp } from '../contexts/AppContext';
import { logger } from '../utilities/logger';
import Metadata from './Metadata';
import Spinner from './Spinner';

export default function DeleteAccount() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const { setAppData } = useApp();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		setError('');
		setAppData((prevData) => ({
			...prevData,
			message: { content: '', colour: 'green' },
		}));

		try {
			logger.info('Attempting account deletion');
			const response = await axios.delete(
				`${environment.apiBase}/delete-account`,
				{ withCredentials: true }
			);

			logger.info('Account deletion successful');

			setAppData((prevData) => ({
				...prevData,
				message: response.data.message,
				authenticated: false,
				user: null,
				noMorePairs: false,
				nextPair: null,
			}));
			navigate('/');
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const message =
					error.response?.data?.message ||
					'Account deletion failed. Please try again.';
				logger.warn('Account deletion failed', { message });
				setError(message);
			} else {
				logger.error('Account deletion error', { error });
				setError('An unexpected error occurred. Please try again later.');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Metadata
				pageName="Delete Account"
				slug="delete-account"
				title="Delete Account"
			/>

			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<img
						alt="Runway Rank"
						src="/favicon.svg"
						className="mx-auto h-10 w-auto"
					/>
					<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
						Delete Account
					</h2>
				</div>
				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form onSubmit={handleSubmit} className="space-y-6">
						<p className="text-center text-sm text-gray-500 dark:text-gray-400">
							Are you sure you want to delete your account? This action
							cannot be undone.
						</p>

						{/* Error message */}
						{error && (
							<div
								className="text-red-600 text-sm font-medium"
								data-testid="delete-account-error-message"
							>
								{error}
							</div>
						)}

						{/* Submit button */}
						<div>
							<button
								type="submit"
								disabled={isLoading}
								data-testid="delete-account-submit-button"
								className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
							>
								{isLoading ? <Spinner /> : 'Delete Account'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
