import React from 'react';
import ReactDOM from 'react-dom/client';
import {
	createBrowserRouter,
	createRoutesFromElements,
	RouterProvider,
	Route,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './App.tsx';
import ErrorElement from './components/ErrorElement.tsx';
import RankRunways from './components/RankRunways/index.tsx';
import About from './components/About.tsx';
import SignIn from './components/SignIn.tsx';
import SignOut from './components/SignOut.tsx';
import CreateAccount from './components/CreateAccount.tsx';
import './index.tailwind.css';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<App />} errorElement={<ErrorElement />}>
			<Route index element={<RankRunways />} />
			<Route path="about" element={<About />} />
			<Route path="create-account" element={<CreateAccount />} />
			<Route path="sign-in" element={<SignIn />} />
			<Route path="sign-out" element={<SignOut />} />
			<Route path="*" element={<ErrorElement />} />
		</Route>
	)
);

ReactDOM.createRoot(document.getElementById('root')! as HTMLElement).render(
	<React.StrictMode>
		<HelmetProvider>
			<RouterProvider router={router} />
		</HelmetProvider>
	</React.StrictMode>
);
