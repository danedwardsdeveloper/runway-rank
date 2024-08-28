import { Link } from 'react-router-dom';

export default function NoMorePairs() {
	return (
		<div className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
			<div className="text-center">
				<p className="text-base font-semibold text-pink-500">
					No more runways
				</p>
				<h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
					Thanks for voting!
				</h1>
				<p className="mt-6 text-base leading-7 text-gray-600">
					You can now access the top runways.
				</p>
				<div className="mt-10 flex items-center justify-center gap-x-6">
					<Link
						to="/top-runways"
						className="rounded-md bg-pink-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
					>
						Top runways
					</Link>
					{/* <a href="#" className="text-sm font-semibold text-gray-900">
						Contact support <span aria-hidden="true">&rarr;</span>
					</a> */}
				</div>
			</div>
		</div>
	);
}
