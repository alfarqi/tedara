import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Extract tenant handle from the first path segment
function getTenantFromPath(): string {
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  return pathSegments[0] || 'demo-store';
}

// Set basename to include tenant
const tenant = getTenantFromPath();
const basename = `/${tenant}`;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)