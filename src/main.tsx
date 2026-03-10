import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Capacitor + Cordova plugin initialization
import { initCapacitor } from './config/capacitor';
import { initCordovaPlugins } from './config/cordova';
// @capawesome import to ensure it's referenced
import '@capawesome/capacitor-app-update';

// Initialize platform integrations
initCapacitor();
initCordovaPlugins();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
