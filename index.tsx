
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
  log("Mounting process starting...");
  const container = document.getElementById('root');
  if (!container) {
    log("CRITICAL: Root container not found in DOM");
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    log("App successfully rendered to root.");
    
    // Hide the loader
    setTimeout(() => {
      const loader = document.getElementById('loading-screen');
      if (loader) {
        loader.classList.add('hidden');
        log("Loading screen dismissed.");
      }
    }, 100);

  } catch (error: any) {
    log(`Mounting failed: ${error.message}`);
    console.error("Mounting failed:", error);
  }
};

// Check ready state to mount
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  mountApp();
} else {
  document.addEventListener('DOMContentLoaded', mountApp);
}
