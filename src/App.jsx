import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { Toaster } from 'react-hot-toast';

import store from './state/store';
import Router from './routes';
import ThemeProvider from './theme';
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import Loader from './Loader'; // ✅ Import loader

const persistor = persistStore(store);

// ----------------------------------------------------------------------

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Suspense fallback={<Loader text="Loading app..." />}> {/* ✅ Replaced div with Loader */}
          <HelmetProvider>
            <BrowserRouter>
              <ThemeProvider>
                <ScrollToTop />
                <StyledChart />
                <Router />
                <Toaster
                  position="top-center"
                  reverseOrder={false}
                  toastOptions={{
                    duration: 5000,
                    style: {
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#555',
                      padding: '15px',
                      maxWidth: '382px',
                    },
                  }}
                />
              </ThemeProvider>
            </BrowserRouter>
          </HelmetProvider>
        </Suspense>
      </PersistGate>
    </Provider>
  );
}
