import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Product } from './pages/Product';
import { Dynamic } from './pages/Dynamic';

// Extract tenant from the current path
function getTenantFromPath(): string {
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  return pathSegments[0] || 'demo-store';
}

function App() {
  const tenant = getTenantFromPath();

  return (
    <Routes>
      <Route path="/" element={<Home tenant={tenant} />} />
      <Route path="/catalog" element={<Catalog tenant={tenant} />} />
      <Route path="/product/:slug" element={<Product tenant={tenant} />} />
      <Route path="/:slug" element={<Dynamic tenant={tenant} />} />
    </Routes>
  );
}

export default App;