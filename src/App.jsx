import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getCart } from './api/cart';
import { setLocalCart } from './store/cartSlice';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import HomePage from './pages/HomePage/HomePage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import WishlistPage from './pages/WishlistPage/WishlistPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import CartPage from "./pages/CartPage/CartPage";

export default function App() {
  const dispatch = useDispatch();

  // Cargar el carrito del backend al iniciar o refrescar la página
  useEffect(() => {
    async function fetchInitialCart() {
      try {
        const cartData = await getCart();
        const items = Array.isArray(cartData) ? cartData : cartData?.items || [];
        
        // Formateamos los ítems asegurando que tengan nombre, precio e imagen
        const formattedItems = items.map(item => ({
          id: item.id, // <-- Guardamos el ID del CartItem para poder usar el botón eliminar en el carrito
          productId: item.productId || item.product?.id,
          name: item.product?.name || 'Producto',
          price: Number(item.product?.price || 0),
          imageUrl: item.product?.imageUrl,
          quantity: item.quantity
        }));

        dispatch(setLocalCart(formattedItems));
      } catch (error) {
        console.log('No hay sesión activa o el usuario no está logueado:', error.message);
      }
    }

    fetchInitialCart();
  }, [dispatch]);

  return (
    <Router>
      <Header />

      <main style={{ minHeight: '80vh', padding: '2rem 1rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}