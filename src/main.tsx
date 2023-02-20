import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './app/store';
import '../src/styles/globals.scss';

import { PortalProvider } from './contexts/portal-context';

export const BACKEND_URL =
  'https://book-reviews-backend-latest.onrender.com/api';
// export const BACKEND_URL = '/api';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PortalProvider>
          <App />
        </PortalProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
