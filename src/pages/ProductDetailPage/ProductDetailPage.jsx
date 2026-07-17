import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage() {
  const { id } = useParams(); // Obtenemos el id de la URL
  const [quantity, setQuantity] = useState(1);

  // Buscamos el producto que coincide con el id de la URL
  const product = MOCK_PRODUCTS.find((p) => p.id === id);

  // Si el producto no existe, mostramos un aviso
  if (!product) {
    return (
      <div>
        <h2>Producto no encontrado</h2>
        <Link to="/products">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <img src={product.imageUrl} alt={product.name} className={styles.image} />

      <div className={styles.info}>
        <h1>{product.name}</h1>
        <p className={styles.price}>{product.price} €</p>
        <p>{product.description}</p>

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