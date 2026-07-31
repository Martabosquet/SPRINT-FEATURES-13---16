import { useSelector, useDispatch } from 'react-redux';
import CartSummary from '../../components/CartSummary/CartSummary';
import StatusMessage from '../../components/StatusMessage/StatusMessage';
import { removeItem } from '../../api/cart';
import { removeLocalCartItem } from '../../store/cartSlice';
import styles from './CartPage.module.css';

function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  const handleRemove = async (productId) => {
    try {
      // 1. Petición al backend para borrar el ítem de la base de datos
      await removeItem(productId);
      
      // 2. Actualizamos el estado global de Redux para que desaparezca al instante
      dispatch(removeLocalCartItem(productId));
    } catch (error) {
      console.error('Error al eliminar el producto del carrito', error);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Carrito</p>
        <h2 className={styles.title}>Resumen de compra</h2>
      </section>

      {items.length === 0 ? (
        <StatusMessage
          title="Carrito vacio"
          description="Anade productos para comprobar el flujo completo."
        />
      ) : (
        <section className={styles.layout}>
          <div className={styles.list}>
            {items.map((item) => {
              const targetId = item.productId || item.id;
              
              return (
                <article key={targetId} className={styles.item}>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className={styles.itemImage} />
                  )}
                  <div className={styles.itemDetails}>
                    <p className={styles.name}><strong>{item.name || 'Producto'}</strong></p>
                    <p className={styles.price}>Precio: {item.price} €</p>
                    <p className={styles.quantity}>Cantidad: {item.quantity}</p>
                  </div>

                  <button
                    type="button"
                    className={styles.btnRemove}
                    onClick={() => handleRemove(item.id)}
                  >Eliminar
                  </button>
                </article>
              );
            })}
          </div>

          <CartSummary items={items} />
        </section>
      )}
    </main>
  );
}

export default CartPage;