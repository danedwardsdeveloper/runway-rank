import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { environment } from '../../../environment';
import { logger } from '../../../utilities/logger';

export default function SignInForm() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setErrorMessage(null);

		try {
			logger.info('Attempting to create account', { email });
			await axios.post(
				`${environment.apiBase}/create-account`,
				{ name, email, password },
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			logger.info('Account created successfully', { email });
			navigate('/');
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const message =
					error.response?.data?.message ||
					'Failed to create an account. Please try again.';
				logger.warn('Failed to create an account', { email, message });
				setErrorMessage(message);
			} else {
				logger.error('Account creation error', { email, error });
				setErrorMessage('An error occurred. Please try again.');
			}
		}
	};

	return (
		<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label
						htmlFor="name"
						className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
					>
						Name
					</label>
					<div className="mt-2">
						<input
							id="name"
							name="name"
							type="text"
							required
							autoComplete="name"
							value={name}
							placeholder="First name"
							data-testid="create-account-name-input"
							onChange={(event) => setName(event.target.value)}
							className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 dark:text-white bg-white dark:bg-white/5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 dark:focus:ring-pink-500 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>
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
							data-testid="create-account-email-input"
							onChange={(event) => setEmail(event.target.value)}
							className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 dark:text-white bg-white dark:bg-white/5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 dark:focus:ring-pink-500 sm:text-sm sm:leading-6"
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
							data-testid="create-account-password-input"
							onChange={(event) => setPassword(event.target.value)}
							className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 dark:text-white bg-white dark:bg-white/5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 dark:focus:ring-pink-500 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div>
					{errorMessage && (
						<div className="error text-sm pb-2">
							<p
								className="font-semibold text-center text-red-500 "
								data-testid="create-account-error-message"
							>
								{errorMessage}
							</p>
						</div>
					)}
					<button
						type="submit"
						data-testid="create-account-submit-button"
						className="flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
					>
						Create account
					</button>
				</div>
			</form>

			<p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
				Already have an account?{' '}
				<Link
					to="/sign-in"
					className="font-semibold leading-6 text-pink-600 hover:text-pink-500 dark:text-pink-400 dark:hover:text-pink-300"
				>
					Sign in
				</Link>
			</p>
		</div>
	);
}
