import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { logger } from '../../utilities/logger';

export default function SignInForm() {
	const [email, setEmail] = useState('daniel.edwards96@yahoo.com');
	const [password, setPassword] = useState('SecurePassword');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setErrorMessage(null);

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
				logger.info('Sign-in successful', { email });
				navigate('/');
			} else {
				const data = await response.json();
				const message = data.message || 'Sign-in failed. Please try again.';
				logger.warn('Sign-in failed', { email, message });
				setErrorMessage(message);
			}
		} catch (error) {
			logger.error('Sign-in error', { email, error });
			setErrorMessage('An error occurred. Please try again.');
		}
	};

	return (
		<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
			<form onSubmit={handleSubmit} className="space-y-6">
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
							className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 dark:text-white bg-white dark:bg-white/5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

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
							className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 dark:text-white bg-white dark:bg-white/5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div>
					{errorMessage && (
						<div className="error text-sm pb-2">
							<p className="font-semibold text-center text-red-500 ">
								{errorMessage}
							</p>
						</div>
					)}
					<button
						type="submit"
						className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Sign in
					</button>
				</div>
			</form>

			<p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
				Don't have an account?{' '}
				<Link
					to="/create-account"
					className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
				>
					Create an account
				</Link>
			</p>
		</div>
	);
}
