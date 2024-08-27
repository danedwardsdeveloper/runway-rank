import React from 'react';
import ReactDOM from 'react-dom/client';
import {
	createBrowserRouter,
	createRoutesFromElements,
	RouterProvider,
	Route,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import './index.tailwind.css';

import { AppProvider } from './contexts/AppContext';

import App from './App';
import ErrorElement from './components/ErrorPage';
import RankRunways from './components/RankRunways';
import About from './components/About';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import CreateAccount from './components/CreateAccount';
import Profile from './components/Profile';
import TopRunways from './components/TopRunways';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<App />} errorElement={<ErrorElement />}>
			<Route index element={<RankRunways />} />
			<Route path="about" element={<About />} />
			<Route path="create-account" element={<CreateAccount />} />
			<Route path="sign-in" element={<SignIn />} />
			<Route path="sign-out" element={<SignOut />} />
			<Route path="profile" element={<Profile />} />
			<Route path="top-runways" element={<TopRunways />} />
			<Route path="*" element={<ErrorElement />} />
		</Route>
	)
);

ReactDOM.createRoot(document.getElementById('root')! as HTMLElement).render(
	<React.StrictMode>
		<HelmetProvider>
			<AppProvider>
				<RouterProvider router={router} />
			</AppProvider>
		</HelmetProvider>
	</React.StrictMode>
);
