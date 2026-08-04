import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartSummary from '../../components/CartSummary/CartSummary';
import StatusMessage from '../../components/StatusMessage/StatusMessage';
import { getCart, removeItem, addCartItem, decreaseItemQuantity } from '../../api/cart';
import { setLocalCart } from '../../store/cartSlice';
import styles from './CartPage.module.css';

const normalizeCartItems = (items = []) => items.map((item) => ({
  id: item.id ?? item.cartItemId ?? item.productId,
  productId: item.productId ?? item.product?.id ?? item.id,
  name: item.product?.name || item.name || 'Producto',
  price: Number(item.product?.price ?? item.price ?? 0),
  imageUrl: item.product?.imageUrl ?? item.imageUrl,
  quantity: item.quantity ?? 1,
  stock: item.product?.stock ?? item.stock ?? 0,
}));

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart.items);
  const [stockWarnings, setStockWarnings] = useState({});

  const syncCartWithServer = async () => {
    const cartData = await getCart();
    const cartItems = Array.isArray(cartData) ? cartData : cartData?.items || [];
    dispatch(setLocalCart(normalizeCartItems(cartItems)));
  };

  const clearStockWarning = (itemKey) => {
    setStockWarnings((prev) => ({
      ...prev,
      [itemKey]: '',
    }));
  };

  const handleIncrease = async (item) => {
    const targetId = item.productId || item.id;
    const itemKey = item.id ?? item.productId ?? targetId;
    const maxStock = Number(item.stock ?? 0);

    // Si ya ha alcanzado o superado el stock disponible
    if (maxStock > 0 && item.quantity >= maxStock) {
      setStockWarnings((prev) => ({
        ...prev,
        [itemKey]: 'Has alcanzado el stock máximo disponible para este producto.',
      }));
      return;
    }

    try {
      await addCartItem(targetId, 1);
      clearStockWarning(itemKey);
      await syncCartWithServer();
    } catch (error) {
      const backendMessage = error?.response?.data?.message || error?.response?.data?.error;
      setStockWarnings((prev) => ({
        ...prev,
        [itemKey]: backendMessage || 'No se pudo agregar más unidades al carrito por falta de stock.',
      }));
      console.error('Error al incrementar la cantidad', error);
    }
  };

  const handleDecrease = async (item) => {
    const cartItemId = item.id;
    const itemKey = item.id ?? item.productId ?? cartItemId;

    if (item.quantity <= 1) {
      await handleRemove(cartItemId);
      clearStockWarning(itemKey);
      return;
    }

    try {
      await decreaseItemQuantity(cartItemId, 1);
      clearStockWarning(itemKey); // Limpiamos el aviso si baja del límite
      await syncCartWithServer();
    } catch (error) {
      console.error('Error al disminuir la cantidad', error);
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      await removeItem(cartItemId);
      await syncCartWithServer();
    } catch (error) {
      console.error('Error al eliminar el producto del carrito', error);
    }
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Carrito</p>
        <h2 className={styles.title}>Resumen de compra</h2>
      </section>

      {items.length === 0 ? (
        <StatusMessage
          title="Carrito vacío"
          description="Añade productos para comprobar el flujo completo."
        />
      ) : (
        <section className={styles.layout}>
          <div className={styles.list}>
            {items.map((item) => {
              const targetId = item.id || item.productId;
              const maxStock = Number(item.stock ?? 0);
              const atMaxStock = maxStock > 0 && item.quantity >= maxStock;

              return (
                <article key={targetId} className={styles.item}>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className={styles.itemImage} />
                  )}
                  <div className={styles.itemDetails}>
                    <p className={styles.name}><strong>{item.name || 'Producto'}</strong></p>
                    <p className={styles.price}>Precio: {item.price} €</p>

                    <div className={styles.quantityControls}>
                      <button
                        type="button"
                        className={styles.btnControl}
                        onClick={() => handleDecrease(item)}
                      >
                        -
                      </button>
                      <span>Cantidad: {item.quantity}</span>
                      <button
                        type="button"
                        className={styles.btnControl}
                        onClick={() => handleIncrease(item)}
                        disabled={atMaxStock}
                      >
                        +
                      </button>
                    </div>

                    {/* Mensaje derivado del estado real, no del clic */}
                    {atMaxStock && (
                      <p className={styles.warning}>
                        Has alcanzado el máximo disponible ({maxStock} unidades).
                      </p>
                    )}

                    {/* Mantenemos también los warnings que vienen de errores del backend (ej: race conditions) */}
                    {stockWarnings[item.id ?? item.productId] && (
                      <p className={styles.warning}>
                        {stockWarnings[item.id ?? item.productId]}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    className={styles.btnRemove}
                    onClick={() => handleRemove(item.id)}
                  >
                    Eliminar
                  </button>
                </article>
              );
            })}
          </div>
          
          <CartSummary items={items} onCheckout={handleProceedToCheckout} />
        </section>
      )}
    </main>
  );
}

export default CartPage;