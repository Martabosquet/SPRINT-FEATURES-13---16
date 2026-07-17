import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useProduct } from '../../hooks/useProduct';
import { useReviews } from '../../hooks/useReviews';
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

      {/* SECCIÓN DE VALORACIONES (REVIEWS) */}
      <div style={{ borderTop: '1px solid #eee', paddingTop: '2rem' }}>
        <h2>Valoraciones del Producto</h2>

        {/* Estado de carga de las reviews */}
        {reviewsLoading && <p>Cargando comentarios...</p>}

        {/* Estado de error de las reviews */}
        {reviewsError && <p style={{ color: 'red' }}>No se pudieron cargar las valoraciones.</p>}

        {/* Caso: No hay ninguna review todavía */}
        {!reviewsLoading && !reviewsError && (!reviews || reviews.length === 0) && (
          <p style={{ color: 'var(--text-light)', marginTop: '1rem' }}>
            Este producto aún no tiene valoraciones. ¡Sé el primero!
          </p>
        )}

        {/* Caso: Lista de reviews real */}
        {!reviewsLoading && !reviewsError && reviews && reviews.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {reviews.map((review) => {
              const reviewId = review.id || review._id;
              return (
                <div
                  key={reviewId}
                  style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}
                >
                  <p style={{ fontWeight: 'bold', margin: 0 }}>
                    {review.user?.name || review.username || review.user || 'Usuario Anónimo'} {/* quiero que me busque el nombre del usuario que publicó la review */}
                  </p>
                  <p style={{ color: '#ffb400', margin: '0.2rem 0' }}>
                    {'★'.repeat(Math.min(10, Math.max(0, review.rating)))}
                    {'☆'.repeat(Math.min(10, Math.max(0, 10 - review.rating)))} {/* escala en base 10 de rating */}
                    <span style={{ color: '#555', marginLeft: '0.5rem', fontSize: '0.9rem' }}>
                      ({review.rating}/10)
                    </span>
                  </p>
                  <p style={{ margin: 0, color: '#555' }}>
                    {review.comment}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}