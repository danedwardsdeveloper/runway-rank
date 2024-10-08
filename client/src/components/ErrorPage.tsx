import { useRouteError, Link } from 'react-router-dom';

import Metadata from './Metadata';

export default function ErrorElement() {
	const error = useRouteError();
	console.error(error);

	let errorMessage: string;

	if (error instanceof Error) {
		errorMessage = error.message;
	} else if (
		typeof error === 'object' &&
		error !== null &&
		'statusText' in error
	) {
		errorMessage = String(error.statusText);
	} else if (typeof error === 'string') {
		errorMessage = error;
	} else {
		errorMessage = `Sorry, we couldn't find the page you're looking for.`;
	}

	return (
		<>
			<Metadata
				pageName="404 Error"
				title="Page not found"
				slug="not-found"
			/>

			<div className="grid place-items-center  px-6 py-24 sm:py-32 lg:px-8">
				<div className="text-center">
					<p className="text-base font-semibold text-red-600">404</p>
					<h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
						Page not found
					</h1>
					<p className="mt-6 text-base leading-7 text-red-500">
						{errorMessage}
					</p>
					<div className="mt-10 flex items-center justify-center gap-x-6">
						<Link
							to="/"
							className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
						>
							Go back home
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
