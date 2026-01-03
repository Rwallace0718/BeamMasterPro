
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("index.tsx: Execution started");

const mountApp = () => {
  console.log("index.tsx: Attempting to mount...");
  const container = document.getElementById('root');
  
  if (!container) {
    console.error("index.tsx: Root container not found!");
    return;
  }

  try {
    const root = createRoot(container);
    console.log("index.tsx: Root created, rendering App");
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("index.tsx: Render call complete");
  } catch (err) {
    console.error("index.tsx: Mounting error:", err);
    const errorDisplay = document.getElementById('error-display');
    if (errorDisplay) {
      errorDisplay.style.display = 'block';
      errorDisplay.innerHTML = '<strong>Mount Error:</strong> ' + (err instanceof Error ? err.message : String(err));
    }
  }
};

// Handle different load states
if (document.readyState === 'loading') {
  console.log("index.tsx: DOM still loading, adding listener");
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  console.log("index.tsx: DOM ready, mounting immediately");
  mountApp();
}
