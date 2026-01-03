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

log("index.tsx module execution started.");

const mountApp = () => {
  log("Attempting to mount React tree...");
  const container = document.getElementById('root');
  if (!container) {
    log("ERROR: #root element missing.");
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    log("Render successful.");
    
    // Hide the loader as soon as React takes over
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.classList.add('hidden');
      log("Interface visible.");
    }
  } catch (error: any) {
    log(`MOUNT CRASH: ${error.message}`);
  }
};

// Mount immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}