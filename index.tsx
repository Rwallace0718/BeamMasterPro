import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const log = (msg: string) => {
  const time = new Date().toLocaleTimeString();
  const entry = `[${time}] [Module] ${msg}`;
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

log("index.tsx evaluation phase started.");

const mountApp = () => {
  log("Mount sequence initiated.");
  const container = document.getElementById('root');
  if (!container) {
    log("ERROR: Mounting point #root not found.");
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    log("React root rendered.");
    
    // Hide the loader as soon as React takes over
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.classList.add('hidden');
      log("Interface is now live.");
    }
  } catch (error: any) {
    log(`CRITICAL MOUNT FAILURE: ${error.message}`);
    console.error(error);
  }
};

// Start mounting immediately or on interactive
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}