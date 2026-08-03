import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // 1. Importamos useNavigate
import CartSummary from '../../components/CartSummary/CartSummary';
import StatusMessage from '../../components/StatusMessage/StatusMessage';
import { removeItem, addCartItem, decreaseItemQuantity } from '../../api/cart';
import { removeLocalCartItem, addLocalCartItem } from '../../store/cartSlice';
import styles from './CartPage.module.css';

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 2. Inicializamos navigate
  const items = useSelector((state) => state.cart.items);

  const handleIncrease = async (item) => {
    const targetId = item.productId || item.id;
    const maxStock = item.stock ?? 10;

    if (item.quantity >= maxStock) return;

    try {
      await addCartItem(targetId, 1);
      dispatch(addLocalCartItem({
        productId: targetId,
        quantity: 1
      }));
    } catch (error) {
      console.error('Error al incrementar la cantidad', error);
    }
  };

  const handleDecrease = async (item) => {
    const cartItemId = item.id; // ID del registro en el carrito
    const productId = item.productId || item.id;

    if (item.quantity <= 1) {
      handleRemove(cartItemId);
      return;
    }

    try {
      await decreaseItemQuantity(cartItemId, 1);
      
      dispatch(addLocalCartItem({
        productId: productId,
        quantity: -1
      }));
    } catch (error) {
      console.error('Error al disminuir la cantidad', error);
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      await removeItem(cartItemId);
      dispatch(removeLocalCartItem(cartItemId));
    } catch (error) {
      console.error('Error al eliminar el producto del carrito', error);
    }
  };

  // 3. Función para redirigir al checkout
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
              const maxStock = item.stock ?? 10;
              const isAtMax = item.quantity >= maxStock;
              
              return (
                <article key={targetId} className={styles.item}>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className={styles.itemImage} />
                  )}
                  <div className={styles.itemDetails}>
                    <p className={styles.name}><strong>{item.name || 'Producto'}</strong></p>
                    <p className={styles.price}>Precio: {item.price} €</p>
                    
                    <p className={styles.stockInfo}>
                      Stock disponible: <strong>{maxStock}</strong>
                    </p>
                    
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
                        disabled={isAtMax}
                        title={isAtMax ? "Límite máximo de stock alcanzado" : ""}
                      >
                        +
                      </button>
                    </div>

                    {isAtMax && (
                      <span className={styles.warning}>Límite de stock alcanzado</span>
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
          
          {/* 4. Le pasamos la función de checkout al resumen de compra para que active el botón */}
          <CartSummary items={items} onCheckout={handleProceedToCheckout} />
        </section>
      )}
    </main>
  );
}

export default CartPage;