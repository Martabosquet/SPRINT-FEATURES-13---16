import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useProduct } from '../../hooks/useProduct';
import { useReviews } from '../../hooks/useReviews';
import ReviewList from '../../components/ReviewList/ReviewList';
import { addCartItem } from '../../api/cart';
import { addLocalCartItem } from '../../store/cartSlice';
import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: product, loading: productLoading, error: productError } = useProduct(id);
  const { data: reviews, loading: reviewsLoading, error: reviewsError } = useReviews(id);

  const handleAddToCart = async () => {
    const userName = localStorage.getItem('userName');
    if (!userName) {
      navigate('/login');
      return;
    }

    setAdding(true);
    setAddError(null);

    try {
      await addCartItem(product.id, quantity);

      dispatch(
        addLocalCartItem({
          id: product.id,
          name: product.name,
          price: Number(product.price ?? 0),
          quantity,
          imageUrl: product.imageUrl,
        })
      );
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
          <p>{product.description || 'Este producto no tiene descripción disponible.'}</p>

          <div className={styles.counter}>
            <button
              className={styles['btn-counter']}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              className={styles['btn-counter']}
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>

          <button
            className={styles['btn-add']}
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? 'Añadiendo...' : 'Añadir al carrito'}
          </button>

          {addError && <p className={styles.errorText}>{addError}</p>}

          <div className={styles.backLinkWrapper}>
            <Link to="/products" className={styles.linkPrimary}>
              &larr; Volver al catálogo
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.reviewsSection}>
        <h2>Valoraciones del Producto</h2>
        <ReviewList reviews={reviews} loading={reviewsLoading} error={reviewsError} />
      </div>
    </div>
  );
}