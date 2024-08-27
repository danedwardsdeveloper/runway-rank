import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AppData } from '../../../types';
import { defaultAppData } from './defaultAppData';

interface AppContextType {
	appData: AppData;
	setAppData: React.Dispatch<React.SetStateAction<AppData>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
	children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
	const [appData, setAppData] = useState<AppData>(defaultAppData);

	return (
		<AppContext.Provider value={{ appData, setAppData }}>
			{children}
		</AppContext.Provider>
	);
};

export const useApp = () => {
	const context = useContext(AppContext);
	if (context === undefined) {
		throw new Error('useApp must be used within an AppProvider');
	}
	return context;
};
