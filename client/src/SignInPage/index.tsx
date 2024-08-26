import Metadata from '../components/Metadata';
import SignInForm from './components/SignInForm';

export default function SignInPage() {
	return (
		<>
			<Metadata pageName="Sign in" slug="sign-in" />;
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<img
						alt="Runway Rank"
						src="/favicon.svg"
						className="mx-auto h-10 w-auto"
					/>
					<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
						Sign in to your account
					</h2>
				</div>
				<SignInForm />
			</div>
		</>
	);
}
