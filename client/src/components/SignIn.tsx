import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useApp } from '../contexts/AppContext';
import { logger } from '../utilities/logger';
import Metadata from './Metadata';
import Spinner from './Spinner';

export default function SignInForm() {
	const [email, setEmail] = useState('test@gmail.com');
	const [password, setPassword] = useState('SecurePassword');
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { setAppData } = useApp();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		setAppData((prevData) => ({ ...prevData, message: '' }));

		try {
			logger.info('Attempting sign-in', { email });
			const response = await fetch(`http://localhost:3000/sign-in`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
				credentials: 'include',
			});

			if (response.ok) {
				const responseData = await response.json();
				logger.info('Sign-in successful', { email });

				setAppData((prevData) => ({
					...prevData,
					message: responseData.message,
					authenticated: responseData.user.authenticated,
					user: responseData.user.user,
					noMorePairs: responseData.user.noMorePairs,
					nextPair: responseData.nextPair,
				}));
				setTimeout(() => navigate('/profile'), 1500);
			} else {
				const data = await response.json();
				const message = data.message || 'Sign-in failed. Please try again.';
				logger.warn('Sign-in failed', { email, message });
				setAppData((prevData) => ({ ...prevData, message }));
				setIsLoading(false);
			}
		} catch (error) {
			logger.error('Sign-in error', { email, error });
			setAppData((prevData) => ({
				...prevData,
				message: 'An error occurred. Please try again.',
			}));
			setIsLoading(false);
		}
	};

	return (
		<>
			<Metadata pageName="Sign in" slug="sign-in" />

			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<img
						alt="Runway Rank"
						src="/favicon.svg"
						className="mx-auto h-10 w-auto"
					/>
					<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
						Sign in
					</h2>
				</div>
				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Email input */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
							>
								Email address
							</label>
							<div className="mt-2">
								<input
									id="email"
									name="email"
									type="email"
									required
									autoComplete="email"
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 dark:text-white bg-white dark:bg-white/5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 dark:focus:ring-pink-500 sm:text-sm sm:leading-6"
									disabled={isLoading}
								/>
							</div>
						</div>

						{/* Password input */}
						<div>
							<div className="flex items-center justify-between">
								<label
									htmlFor="password"
									className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
								>
									Password
								</label>
							</div>
							<div className="mt-2">
								<input
									id="password"
									name="password"
									type="password"
									required
									autoComplete="current-password"
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 dark:text-white bg-white dark:bg-white/5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 dark:focus:ring-pink-500 sm:text-sm sm:leading-6"
									disabled={isLoading}
								/>
							</div>
						</div>

						{/* Submit button */}
						<div>
							<button
								type="submit"
								disabled={isLoading}
								className="flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 disabled:opacity-50"
							>
								{isLoading ? <Spinner /> : 'Sign in'}
							</button>
						</div>
					</form>

					{/* Link to create account */}
					<p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
						Don't have an account?{' '}
						<Link
							to="/create-account"
							className="font-semibold leading-6 text-pink-600 hover:text-pink-500 dark:text-pink-400 dark:hover:text-pink-300"
						>
							Create an account
						</Link>
					</p>
				</div>
			</div>
		</>
	);
}