import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import 'bootstrap/dist/css/bootstrap.min.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// Register the service worker to enable offline support
// serviceWorkerRegistration.register();
