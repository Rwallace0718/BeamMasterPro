
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("index.tsx: Execution started");

const init = () => {
  const container = document.getElementById('root');
  if (!container) {
    console.error("index.tsx: Root container not found");
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("index.tsx: App rendered successfully");
  } catch (err) {
    console.error("index.tsx: Render error", err);
  }
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}
