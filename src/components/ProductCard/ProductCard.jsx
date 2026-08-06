import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import WishlistButton from '../WishlistButton/WishlistButton';
import { deleteProduct } from '../../api/products';
import { authStorage } from '../../utils/authStorage';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, onProductDeleted }) {
  const [imgSrc, setImgSrc] = useState(product.imageUrl);
  const [userName, setUserName] = useState(() => authStorage.userName);
  const [isAdmin, setIsAdmin] = useState(() => authStorage.admin === 'true');

  useEffect(() => {
    const syncAuth = () => {
      setUserName(authStorage.userName);
      setIsAdmin(authStorage.admin === 'true');
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

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm(`¿Estás segura de que quieres eliminar "${product.name}"?`)) {
      return;
    }

    try {
      await deleteProduct(correctedId);
      if (onProductDeleted) {
        onProductDeleted(correctedId);
      }
    } catch (err) {
      console.error('Error al eliminar el producto:', err);
      alert('No se pudo eliminar el producto.');
    }
  };

  return (
    <div className={styles.card}>
      {userName && quantity > 0 && (
        <span className={styles.badge}>{quantity}</span>
      )}

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

        {userName && (
          <div className={styles.wishlistWrapper}>
            <WishlistButton productId={correctedId} />
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.price}>{Number(product.price).toFixed(2)} €</p>

        {(product.createdBy || product.author || product.userName) && (
          <p className={styles.creator}>
            Por:{' '}
            <Link 
              to={`/users/${product.createdBy || product.author || product.userName}`}
              className={styles.creatorLink}
            >
              {product.createdBy || product.author || product.userName}
            </Link>
          </p>
        )}

        <p
          className={`${styles.stock} ${
            isAgotado
              ? styles.outOfStock
              : maxStock <= 5
              ? styles.lowStock
              : styles.inStock
          }`}
        >
          {isAgotado
            ? '❌ Agotado'
            : maxStock <= 5
            ? '⚠️ Pocas unidades disponibles'
            : '✓ Disponible'}
        </p>

        <Link
          to={`/products/${correctedId}`}
          className={`${styles.button} ${isAgotado ? styles.disabledButton : ''}`}
          aria-label={`Ver detalle del producto ${product.name}`}
        >
          {isAgotado ? 'Ver detalles' : 'Ver detalle'}
        </Link>

        {isAdmin && (
          <button 
            onClick={handleDelete}
            className={styles.deleteButton}
          >
            Eliminar Producto
          </button>
        )}
      </div>
    </div>
  );
}