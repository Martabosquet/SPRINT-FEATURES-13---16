import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useProduct } from '../../hooks/useProduct';
import { useReviews } from '../../hooks/useReviews';
import ReviewList from '../../components/ReviewList/ReviewList';
import ReviewForm from '../../components/ReviewForm/ReviewForm';
import { addCartItem, getCart } from '../../api/cart';
import { setLocalCart } from '../../store/cartSlice';
import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState(null);
  const userName = localStorage.getItem('userName');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: product, loading: productLoading, error: productError } = useProduct(id);
  const { data: reviews, loading: reviewsLoading, error: reviewsError } = useReviews(id);

  // Stock máximo disponible (por defecto 10 si no viene definido en el producto)
  const maxStock = product?.stock ?? 10;

  // Función para manejar cuando se añade una review
  const handleReviewAdded = () => {
    window.location.reload(); // Recarga los datos para mostrar la nueva reseña
  };

  const handleAddToCart = async () => {
    if (!userName) {
      navigate('/login');
      return;
    }

    setAdding(true);
    setAddError(null);

    try {
      await addCartItem(product.id, quantity);

      const cartData = await getCart();
      const items = Array.isArray(cartData) ? cartData : cartData?.items || [];

      dispatch(
        setLocalCart(
          items.map((item) => ({
            id: item.id ?? item.cartItemId ?? item.productId,
            productId: item.productId ?? item.product?.id ?? item.id,
            name: item.product?.name || item.name || 'Producto',
            price: Number(item.product?.price ?? item.price ?? 0),
            imageUrl: item.product?.imageUrl ?? item.imageUrl,
            quantity: item.quantity ?? 1,
            stock: item.product?.stock ?? item.stock ?? 0,
          }))
        )
      );

      navigate('/cart');
    } catch (err) {
      console.error(err);
      setAddError('No se pudo añadir el producto al carrito. Inténtalo de nuevo.');
    } finally {
      setAdding(false);
    }
  };

  if (productLoading) {
    return <p className={styles.centeredMessage}>Cargando producto...</p>;
  }

  if (productError || !product) {
    return (
      <div className={styles.centeredContainer}>
        <h2>Producto no encontrado</h2>
        <p className={styles.notFoundDescription}>
          El artículo que buscas no existe en nuestra base de datos.
        </p>
        <Link to="/products" className={styles.linkPrimary}>
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.productSection}>
        <img
          src={product.imageUrl || 'https://placehold.co/400x400?text=Sin+Imagen'}
          alt={product.name}
          className={styles.image}
        />

        <div className={styles.info}>
          <h1>{product.name}</h1>
          <p className={styles.price}>{product.price} €</p>
          
          <p className={styles.stockInfo}>
            Stock disponible: <strong>{maxStock} unidades</strong>
          </p>

          <p>{product.description || 'Este producto no tiene descripción disponible.'}</p>

          <div className={styles.counter}>
            <button
              type="button"
              className={styles['btn-counter']}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              className={styles['btn-counter']}
              onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
              disabled={quantity >= maxStock}
            >
              +
            </button>
          </div>

          {quantity >= maxStock && (
            <p className={styles.stockWarning}>Has alcanzado el límite máximo de stock.</p>
          )}

          <button
            type="button"
            className={styles['btn-add']}
            onClick={handleAddToCart}
            disabled={adding || maxStock === 0}
          >
            {maxStock === 0 ? 'Agotado' : adding ? 'Añadiendo...' : 'Añadir al carrito'}
          </button>

          {addError && <p className={styles.errorText}>{addError}</p>}

          <div className={styles.backLinkWrapper}>
            <Link to="/products" className={styles.linkPrimary}>
              &larr; Volver al catálogo
            </Link>
          </div>
        </div>
      </div>

      {/* Sección de valoraciones y formulario correctamente integrados */}
      <div className={styles.reviewsSection}>
        <h2>Valoraciones del Producto</h2>
        <ReviewList reviews={reviews} loading={reviewsLoading} error={reviewsError} />

        {userName ? (
          <ReviewForm productId={product.id || product._id} onReviewAdded={handleReviewAdded} />
        ) : (
          <p className={styles.loginPrompt}>
            <Link to="/login">Inicia sesión</Link> para dejar una valoración.
          </p>
        )}
      </div>
    </div>
  );
}