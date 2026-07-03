import './assets/main.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import AppContextProvider from './context-providers/app-context';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <AppContextProvider>
    <App />
  </AppContextProvider>
  // </StrictMode>
);
