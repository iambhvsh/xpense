import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { dbHelpers } from './lib/db';

// Expose cleanup function for debugging
if (typeof window !== 'undefined') {
  (window as any).cleanupDuplicateCategories = async () => {
    const removed = await dbHelpers.removeDuplicateCategories();
    console.log(`Removed ${removed} duplicate categories`);
    return removed;
  };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);