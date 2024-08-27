import { Outlet, useRouteError } from 'react-router-dom';

import MenuBar from './components/MenuBar';
import ErrorElement from './components/ErrorPage';

export default function App() {
	const error = useRouteError();

	return (
		<div className="flex flex-col h-screen">
			<MenuBar />
			<main className="flex-1 overflow-auto bg-gradient-to-r from-violet-100 to-pink-100">
				{error ? <ErrorElement /> : <Outlet />}
			</main>
		</div>
	);
}
