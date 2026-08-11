import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import HomePage from '../pages/HomePage/HomePage';
import ProductsPage from '../pages/ProductsPage/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage/ProductDetailPage';
import CreateProductPage from '../pages/CreateProductPage/CreateProductPage';
import EditProductPage from '../pages/CreateProductPage/EditProductPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import PublicProfilePage from '../pages/PublicProfilePage/PublicProfilePage';
import CartPage from '../pages/CartPage/CartPage';
import WishlistPage from '../pages/WishlistPage/WishlistPage';
import CheckoutPage from '../pages/CheckoutPage/CheckoutPage';
import CheckoutSuccessPage from '../pages/CheckoutSuccessPage/CheckoutSuccessPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import { authStorage } from '../utils/authStorage';

const isAdminUser = () => {
  return authStorage.admin === 'true';
};

// Ya no depende solo de "admin": comprobamos si hay sesión iniciada,
// usando la misma señal que ya usa el resto de la app (Header, ProductCard...).
const isLoggedIn = () => {
  return Boolean(authStorage.userName);
};

const AdminRoute = ({ children }) => {
  return isAdminUser() ? children : <Navigate to="/products" replace />;
};

// Exige solo sesión iniciada, sin importar el rol.
// Si no hay sesión, redirige a /login, guardando la ruta de origen en el
// state para poder devolver al usuario ahí después de iniciar sesión.
const ProtectedRoute = ({ children }) => {
  return isLoggedIn()
    ? children
    : <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
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
        path: 'admin/products/new',
        element: (
          <AdminRoute>
            <CreateProductPage />
          </AdminRoute>
        )
      },
      {
        path: 'admin/products/:id/edit',
        element: (
          <AdminRoute>
            <EditProductPage />
          </AdminRoute>
        )
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        )
      },
      {
        path: '/profile/:userId',
        element: <PublicProfilePage />
      },
      {
        path: 'cart',
        element: (
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'wishlist',
        element: (
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'checkout-success',
        element: (
          <ProtectedRoute>
            <CheckoutSuccessPage />
          </ProtectedRoute>
        )
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);