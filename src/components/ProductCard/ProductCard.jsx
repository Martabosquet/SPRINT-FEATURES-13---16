import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const [imgSrc, setImgSrc] = useState(product.imageUrl);
  const [userName, setUserName] = useState(() => localStorage.getItem('userName'));

  useEffect(() => {
    const syncAuth = () => {
      setUserName(localStorage.getItem('userName'));
    };

    window.addEventListener('authChange', syncAuth);
    window.addEventListener('storage', syncAuth);
    syncAuth();

    return () => {
      window.removeEventListener('authChange', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  const handleImageError = () => {
    setImgSrc('https://placehold.co/300x200?text=Sin+Imagen');
  };

  const correctedId = product.id || product._id;
  const maxStock = product.stock ?? 10;
  const isAgotado = maxStock === 0;

  const cartItems = useSelector((state) => state.cart.items);
  const cartItem = cartItems.find((item) => item.id === correctedId || item.productId === correctedId);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className={styles.card}>
      {/* 🔴 Bolita roja del carrito (solo si hay sesión y cantidad > 0) */}
      {userName && quantity > 0 && (
        <span className={styles.badge}>{quantity}</span>
      )}

      {/* 🏷️ Etiqueta de Agotado si el stock es 0 */}
      {isAgotado && (
        <span className={styles.outOfStockBadge}>Agotado</span>
      )}

      <div className={styles.imageContainer}>
        <img
          src={imgSrc}
          alt={product.name}
          className={`${styles.image} ${isAgotado ? styles.grayscale : ''}`}
          onError={handleImageError}
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.price}>{Number(product.price).toFixed(2)} €</p>

        <p className={styles.stock}>
          Stock disponible: <strong>{isAgotado ? '0' : maxStock}</strong>
        </p>

        <Link
          to={`/products/${correctedId}`}
          className={`${styles.button} ${isAgotado ? styles.disabledButton : ''}`}
          aria-label={`Ver detalle del producto ${product.name}`}
        >
          {isAgotado ? 'Ver detalles' : 'Ver detalle'}
        </Link>
      </div>
    </div>
  );
}