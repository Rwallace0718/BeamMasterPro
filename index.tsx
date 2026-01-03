import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const log = (msg: string) => {
  const time = new Date().toLocaleTimeString();
  if ((window as any).diagLogs) {
    (window as any).diagLogs.push(`[${time}] [React] ${msg}`);
    const el = document.getElementById('diag-content');
    if (el) {
      el.innerText = (window as any).diagLogs.join('\n');
      el.scrollTop = el.scrollHeight;
    }
  }
  console.log(`[React] ${msg}`);
};

const mountApp = () => {
  log("Mount sequence started.");
  const container = document.getElementById('root');
  if (!container) {
    log("CRITICAL ERROR: #root container not found in DOM.");
    return;
  }

  try {
    log("Creating React root...");
    const root = createRoot(container);
    log("Rendering App component...");
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    log("App render command issued.");
    
    // Deactivate loading screen once rendering is underway
    const hideLoader = () => {
      const loader = document.getElementById('loading-screen');
      if (loader) {
        loader.classList.add('hidden');
        log("Loading screen cleared successfully.");
      }
    };

    // Use multiple triggers to ensure the screen is hidden
    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
        // Fallback for fast renders or if load event already fired
        setTimeout(hideLoader, 300); 
    }

  } catch (error: any) {
    log(`MOUNT FAILED: ${error.message}`);
    console.error("Mounting error details:", error);
  }
};

// Execute mounting
log("index.tsx module loaded. Checking document state...");
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountApp);
} else {
    mountApp();
}