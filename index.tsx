import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const log = (msg: string) => {
  if ((window as any).diagLogs) {
    (window as any).diagLogs.push(`[${new Date().toLocaleTimeString()}] [React] ${msg}`);
    const el = document.getElementById('diag-content');
    if (el) {
      el.innerText = (window as any).diagLogs.join('\n');
      el.scrollTop = el.scrollHeight;
    }
  }
  console.log(`[React] ${msg}`);
};

const mountApp = () => {
  log("Initializing React application...");
  const container = document.getElementById('root');
  if (!container) {
    log("CRITICAL: DOM Root (#root) missing.");
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    log("Mounting complete.");
    
    // Deactivate loading screen
    const hideLoader = () => {
      const loader = document.getElementById('loading-screen');
      if (loader) {
        loader.classList.add('hidden');
        log("Loading screen cleared.");
      }
    };

    // Use multiple triggers to ensure the screen is hidden
    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
        setTimeout(hideLoader, 500); // Fallback for fast renders
    }

  } catch (error: any) {
    log(`FATAL: React mount failed: ${error.message}`);
    console.error("Mounting error:", error);
  }
};

// Start mounting immediately or on interactive
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountApp);
} else {
    mountApp();
}