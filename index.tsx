
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("index.tsx: Bootstrap initiated");

const startApp = () => {
  console.log("index.tsx: Finding root container...");
  const container = document.getElementById('root');
  
  if (!container) {
    console.error("index.tsx: ERROR - Root container #root not found in DOM");
    return;
  }

  try {
    console.log("index.tsx: Creating React root...");
    const root = createRoot(container);
    
    console.log("index.tsx: Mounting App component...");
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("index.tsx: Render sequence finished");
  } catch (err) {
    console.error("index.tsx: CRITICAL MOUNT ERROR", err);
  }
};

// Robust execution trigger
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  console.log("index.tsx: DOM already ready, starting now");
  startApp();
} else {
  console.log("index.tsx: Waiting for DOMContentLoaded event...");
  document.addEventListener('DOMContentLoaded', startApp);
}
