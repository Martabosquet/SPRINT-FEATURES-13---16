import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import HomePage from '../pages/HomePage/HomePage';
import ProductsPage from '../pages/ProductsPage/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage/ProductDetailPage';
import CreateProductPage from '../pages/CreateProductPage/CreateProductPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';

// Función auxiliar para comprobar si el usuario es administrador
const isAdminUser = () => {
  return localStorage.getItem('admin') === 'true';
};

// Componente protector de rutas para administradores
const AdminRoute = ({ children }) => {
  return isAdminUser() ? children : <Navigate to="/products" replace />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'products',
        element: <ProductsPage />
      },
      {
        path: 'products/:id',
        element: <ProductDetailPage />
      },
      {
        // Nueva ruta protegida para crear productos
        path: 'admin/products/new',
        element: (
          <AdminRoute>
            <CreateProductPage />
          </AdminRoute>
        )
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);