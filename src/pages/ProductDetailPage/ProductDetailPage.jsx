import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
// IMPORTANTE: Cambiamos el antiguo MOCK por nuestro hook de la API real
import { useProduct } from '../../hooks/useProduct';
import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage() {
  // Extraemos el id de la URL (React Router mapea :id automáticamente)
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  // Llamamos al hook real pasando el id de MongoDB
  const { data: product, loading, error } = useProduct(id);

  // 1. Gestionamos el estado de carga mientras el backend responde
  if (loading) {
    return <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando detalle del producto...</p>;
  }

  // 2. Gestionamos si la API devuelve un error (por ejemplo, id inválido)
  if (error || !product) {
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

  // 3. Si el producto existe y terminó de cargar, pintamos la interfaz real
  return (
    <div className={styles.container}>
      {/* Usamos product.imageUrl o el placeholder de rescate por si no tiene imagen */}
      <img
        src={product.imageUrl || 'https://placehold.co/400x400?text=Sin+Imagen'}
        alt={product.name}
        className={styles.image}
      />

      <div className={styles.info}>
        <h1>{product.name}</h1>
        <p className={styles.price}>{product.price} €</p>
        <p>{product.description || 'Este producto no tiene descripción disponible.'}</p>

        {/* Contador de cantidad interactivo local */}
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
  );
}