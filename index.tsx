
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const mountApp = () => {
  const container = document.getElementById('root');
  if (!container) return;

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    // Loading screen is inside #root, so React will replace it automatically.
  } catch (error) {
    console.error("Mounting failed:", error);
  }
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  mountApp();
} else {
  document.addEventListener('DOMContentLoaded', mountApp);
}
