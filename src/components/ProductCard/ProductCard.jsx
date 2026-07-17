import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const [imgSrc, setImgSrc] = useState(product.imageUrl);

  const handleImageError = () => {
    setImgSrc('https://placehold.co/300x200?text=Sin+Imagen');
  };

  // Sacamos el ID idóneo (sea id de Postgres o _id de Mongo)
  const correctedId = product.id || product._id;

  return (
    <div className={styles.card}>
      <img
        src={imgSrc}
        alt={product.name}
        className={styles.image}
        onError={handleImageError}
      />
      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.price}>{product.price} €</p>

        {/* Usamos el identificador corregido que encontramos arriba */}
        <Link
          to={`/products/${correctedId}`}
          className={styles.button}
          aria-label={`Ver detalle del producto ${product.name}`}
        >
          Ver detalle
        </Link>
      </div>
    </div>
  );
}