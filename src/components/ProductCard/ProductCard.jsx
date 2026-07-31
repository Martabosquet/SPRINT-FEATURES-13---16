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

  const cartItems = useSelector((state) => state.cart.items);
  const cartItem = cartItems.find((item) => item.id === correctedId || item.productId === correctedId);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className={styles.card}>
      {userName && quantity > 0 && (
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
        <p className={styles.price}>{Number(product.price).toFixed(2)} €</p>

        {/* Ver el stock disponible */}
        <p className={styles.stock}>
          Stock disponible: <strong>{product.stock ?? 'Disponible'}</strong>
        </p>

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