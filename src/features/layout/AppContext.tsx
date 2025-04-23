import React, { createContext, useContext, useState } from 'react';
import { Coord } from '../navigate/Nearby';

interface AppContextProps {
  favoritesTab: {
    activeTab: string;
    setActiveTab: (tab: string) => void;
  };
  search: {
    searchValue: string;
    setSearchValue: (value: string) => void;
    searchResults: string[];
    setSearchResults: (results: string[]) => void;
  };
  nearby: {
    location: Coord | null;
    setLocation: (location: Coord | null) => void;
    results: string[];
    setResults: (results: string[]) => void;
  }
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('1');

  const [searchValue, setSearchValue] = useState<string>('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const [location, setLocation] = useState<Coord | null>(null);
  const [results, setResults] = useState<string[]>([]);

  return (
    <AppContext.Provider value={{
      favoritesTab: { activeTab, setActiveTab },
      search: { searchValue, setSearchValue, searchResults, setSearchResults },
      nearby: { location, setLocation, results, setResults },
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
