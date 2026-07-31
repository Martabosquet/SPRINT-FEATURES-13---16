import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // 1. Importamos useSelector
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const [imgSrc, setImgSrc] = useState(product.imageUrl);

  const handleImageError = () => {
    setImgSrc('https://placehold.co/300x200?text=Sin+Imagen');
  };

  // Sacamos el ID idóneo (sea id de Postgres o _id de Mongo)
  const correctedId = product.id || product._id;

  // 2. Leemos los ítems del carrito desde Redux
  const cartItems = useSelector((state) => state.cart.items);

  // 3. Buscamos si esta película está en el carrito y obtenemos su cantidad
  const cartItem = cartItems.find((item) => item.id === correctedId || item.productId === correctedId);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className={styles.card}>
      {/* 4. Si hay algo en el carrito para esta peli, mostramos la bolita roja */}
      {quantity > 0 && (
        <span className={styles.badge}>{quantity}</span>
      )}

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