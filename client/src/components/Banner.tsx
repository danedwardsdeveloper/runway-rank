import { Link } from 'react-router-dom';

export default function Banner() {
	return (
		<div className="bg-gray-300 border-l-4 border-gray-700  p-4 mb-4 text-center">
			<p>
				<Link to="/sign-in" className="text-blue-500 hover:underline">
					Sign in
				</Link>
				{' or '}
				<Link
					to="/create-account"
					className="text-blue-600 hover:underline"
				>
					create an account
				</Link>
				{' to vote'}
			</p>
		</div>
	);
}
