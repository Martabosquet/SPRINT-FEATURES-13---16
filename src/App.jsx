import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import HomePage from './pages/HomePage/HomePage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';

// RouterProvider es el componente que inicializa y conecta la configuración del router
// (creada mediante createBrowserRouter) con la aplicación de React. Provee el contexto necesario
// para que componentes como <Link>, <NavLink>, <Outlet> y los hooks (useParams, useNavigate, etc.) funcionen.

export default function App() {
  return (
    <Router>
      <Header />

      {/* Solo el contenido central cambia según la URL */}
      <main style={{ minHeight: '80vh', padding: '2rem 1rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}