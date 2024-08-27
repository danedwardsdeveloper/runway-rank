import Metadata from '../Metadata';
import CreateAccountForm from './components/CreateAccountForm';

export default function SignInPage() {
	return (
		<>
			<Metadata pageName="Create an account" slug="create-account" />;
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<img
						alt="Runway Rank"
						src="/favicon.svg"
						className="mx-auto h-10 w-auto"
					/>
					<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
						Create an account
					</h2>
				</div>
				<CreateAccountForm />
			</div>
		</>
	);
}
