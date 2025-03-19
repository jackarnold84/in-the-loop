import React, { createContext, useContext, useState } from 'react';

interface AppContextProps {
  favoritesTab: {
    activeTab: string;
    setActiveTab: (tab: string) => void;
  };
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('1');

  return (
    <AppContext.Provider value={{
      favoritesTab: { activeTab, setActiveTab },
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
