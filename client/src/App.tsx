import { Outlet, useRouteError } from 'react-router-dom';

import MenuBar from './components/MenuBar';
import ErrorElement from './components/ErrorElement';

export default function App() {
	const error = useRouteError();

	return (
		<>
			<MenuBar />
			<main>{error ? <ErrorElement /> : <Outlet />}</main>
		</>
	);
}
