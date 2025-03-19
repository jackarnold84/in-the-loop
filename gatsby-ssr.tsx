import React, { ReactNode } from 'react';
import { AppProvider } from './src/features/layout/AppContext';

export const wrapRootElement = ({ element }: { element: ReactNode }) => (
  <AppProvider>
    {element}
  </AppProvider>
);