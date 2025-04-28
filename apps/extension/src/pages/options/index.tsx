import React from 'react';
import ReactDOM from 'react-dom/client';
import Options from './Options';
import '../../globals.css';
import { initializeDefaultSettings } from '../../utils/storage';

// Initialize default settings
initializeDefaultSettings().then(() => {
  // Render the Options component
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Options />
    </React.StrictMode>,
  );
}).catch(error => {
  console.error('Failed to initialize settings:', error);
  // Render Options component even if initialization fails
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Options />
    </React.StrictMode>,
  );
});
