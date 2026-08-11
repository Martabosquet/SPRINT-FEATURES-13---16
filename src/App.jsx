import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getCart } from './api/cart';
import { setLocalCart } from './store/cartSlice';
import { router } from "./router/IndexTemp"
export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchInitialCart() {
      try {
        const cartData = await getCart();
        const items = Array.isArray(cartData) ? cartData : cartData?.items || [];

        const formattedItems = items.map(item => ({
          id: item.id,
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

  return <RouterProvider router={router} />;   // Renderiza el router moderno mediante el RouterProvider
}