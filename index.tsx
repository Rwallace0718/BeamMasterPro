import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const log = (msg: string) => {
  const time = new Date().toLocaleTimeString();
  const entry = `[${time}] [Kernel] ${msg}`;
  if ((window as any).diagLogs) {
    (window as any).diagLogs.push(entry);
    const el = document.getElementById('diag-content');
    if (el) {
      el.innerText = (window as any).diagLogs.join('\n');
      el.scrollTop = el.scrollHeight;
    }
  }
  console.log(entry);
};

log("index.tsx processing started.");

const mountApp = () => {
  log("Mounting UI tree...");
  const container = document.getElementById('root');
  if (!container) {
    log("FATAL: Root container not found in DOM.");
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    log("React rendering complete.");
    
    // Deactivate the splash screen once the initial render is queued
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.classList.add('hidden');
      log("Splash screen dismissed.");
    }
  } catch (error: any) {
    log(`CRITICAL MOUNT FAILURE: ${error.message}`);
    console.error(error);
  }
};

// Start mounting process based on document state
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
