import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useProduct } from '../../hooks/useProduct';
import { useReviews } from '../../hooks/useReviews';
import ReviewList from '../../components/ReviewList/ReviewList';
import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage() {
  // Extraemos el id de la URL
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  // Llamamos a ambos hooks pasando el id correcto
  const { data: product, loading: productLoading, error: productError } = useProduct(id);
  const { data: reviews, loading: reviewsLoading, error: reviewsError } = useReviews(id);

  // 1. Gestión de estados de carga y error del PRODUCTO
  if (productLoading) {
    return <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando producto...</p>;
  }

  if (productError || !product) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Producto no encontrado</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
          El artículo que buscas no existe en nuestra base de datos.
        </p>
        <Link to="/products" style={{ color: 'var(--primary-color)' }}>
          Volver al catálogo
        </Link>
      </div>
    );
  }

  // 2. Si el producto existe, pintamos la interfaz completa
  return (
    <div className={styles.container}>
      {/* SECCIÓN DEL PRODUCTO */}
      <div className={styles.productSection} style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
        <img
          src={product.imageUrl || 'https://placehold.co/400x400?text=Sin+Imagen'}
          alt={product.name}
          className={styles.image}
        />

        <div className={styles.info}>
          <h1>{product.name}</h1>
          <p className={styles.price}>{product.price} €</p>
          <p>{product.description || 'Este producto no tiene descripción disponible.'}</p>

          {/* Contador de cantidad */}
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

          <button className={styles['btn-add']}>
            Añadir al carrito
          </button>

          <div style={{ marginTop: '1rem' }}>
            <Link to="/products" style={{ color: 'var(--primary-color)' }}>
              &larr; Volver al catálogo
            </Link>
          </div>
        </div>
      </div>

      {/* SECCIÓN DE VALORACIONES — delegada al componente ReviewList */}
      <div style={{ borderTop: '1px solid #eee', paddingTop: '2rem' }}>
        <h2>Valoraciones del Producto</h2>
        <ReviewList reviews={reviews} loading={reviewsLoading} error={reviewsError} />
      </div>
    </div>
  );
}