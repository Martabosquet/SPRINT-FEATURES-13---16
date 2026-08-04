import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkoutOrder } from '../../api/orders'; // Asegúrate de tener este servicio configurado con Axios
import { clearCart } from '../../store/cartSlice'; // O la acción de Redux que vacíe el carrito local
import Button from '../../components/Button/Button';
import styles from './CheckoutPage.module.css';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const stockIssues = cartItems.filter(
    (item) => Number(item.quantity ?? 0) > Number(item.stock ?? 0)
  );
  const hasStockIssue = stockIssues.length > 0;

  // Estados para la dirección de envío
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cálculo del precio total
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity ?? 0) * Number(item.price ?? 0),
    0
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.street || !formData.city || !formData.postalCode || !formData.country) {
      setError('Por favor, completa todos los campos de la dirección de envío.');
      return;
    }

    setLoading(true);

    try {
      // 1. Llamamos a la API para crear la orden en el backend (Prisma)
      // Enviamos la dirección de envío formateada o como objeto según lo que espere tu backend
      const response = await checkoutOrder({
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      });

      if (response.ok) {
        // 2. Vaciamos el carrito en Redux
        dispatch(clearCart()); // Asegúrate de tener esta acción en tu slice de carrito

        // 3. Redirigimos a la página de éxito pasando el pedido en el state
        navigate('/checkout-success', {
          state: { order: response.data }
        });
      }
    } catch (err) {
      console.error('Error al procesar el pago:', err);
      setError(err.response?.data?.error || 'Hubo un error al procesar el pedido. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <h2>Tu carrito está vacío</h2>
        <p>No hay productos para tramitar el pedido.</p>
        <Button onClick={() => navigate('/products')} variant="primary">
          Ver productos
        </Button>
      </div>
    );
  }

  return (
    <main className={styles.page}>
      <h2 className={styles.title}>Finalizar Compra</h2>

      <div className={styles.container}>
        {/* IZQUIERDA: Formulario de Envío y futura pasarela de Stripe */}
        <section className={styles.section}>
          <h3>Dirección de Envío</h3>
          <form onSubmit={handleSubmitOrder} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="street">Calle y número</label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="city">Ciudad</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label htmlFor="postalCode">Código Postal</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="country">País</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Aquí en el futuro meteremos los componentes de Stripe Elements */}
            <div className={styles.stripePlaceholder}>
              <p>💳 El pago con tarjeta (Stripe) se integrará aquí próximamente.</p>
            </div>

            {hasStockIssue && (
              <div className={styles.stockErrorBox}>
                <p className={styles.stockError}>
                  No puedes continuar con el pedido porque estos productos superan el stock disponible:
                </p>
                <ul className={styles.stockIssueList}>
                  {stockIssues.map((item) => (
                    <li key={item.id || item.productId}>
                      <strong>{item.name || 'Producto'}</strong>: tienes {item.quantity} unidades, pero solo quedan {item.stock} disponibles.
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.submitButton} disabled={loading || hasStockIssue}>
              {loading ? 'Procesando...' : `Pagar ${totalPrice.toFixed(2)} €`}
            </button>
          </form>
        </section>

        {/* DERECHA: Resumen Visual del Carrito */}
        <section className={styles.summarySection}>
          <h3>Resumen del Carrito</h3>
          <ul className={styles.itemList}>
            {cartItems.map((item) => (
              <li key={item.id || item.productId} className={styles.itemRow}>
                <span>{item.name} (x{item.quantity})</span>
                <span>{(Number(item.price) * Number(item.quantity)).toFixed(2)} €</span>
              </li>
            ))}
          </ul>
          <hr className={styles.divider} />
          <div className={styles.totalRow}>
            <span>Total a pagar:</span>
            <span className={styles.totalPrice}>{totalPrice.toFixed(2)} €</span>
          </div>
        </section>
      </div>
    </main>
  );
}