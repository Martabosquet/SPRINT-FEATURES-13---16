import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import HomePage from '../pages/HomePage/HomePage';
import ProductsPage from '../pages/ProductsPage/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage/ProductDetailPage';
import CreateProductPage from '../pages/CreateProductPage/CreateProductPage';
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
        path: 'admin/products/new',
        element: (
          <AdminRoute>
            <CreateProductPage />
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
        element: <ProfilePage />
      },
      {
        path: '/profile/:userId',
        element: <PublicProfilePage />
      },
      {
        path: 'cart',
        element: <CartPage />
      },
      {
        path: 'wishlist',
        element: <WishlistPage />
      },
      {
        path: 'checkout',
        element: <CheckoutPage />
      },
      {
        path: 'checkout-success',
        element: <CheckoutSuccessPage />
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);