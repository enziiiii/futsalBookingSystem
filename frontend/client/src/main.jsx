import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './store.js';

/* Default
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
) */


// wraping the app to include AuthProvider
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);