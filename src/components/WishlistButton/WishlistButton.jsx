import { useState, useEffect } from 'react';
import { addToWishlist, removeFromWishlist, getWishlist } from '../../api/wishlist';
import styles from './WishlistButton.module.css';

export default function WishlistButton({ productId }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const wishlistItems = await getWishlist();
        if (Array.isArray(wishlistItems)) {
          // 🟢 Comparamos transformando ambos a String para evitar discrepancias
          const exists = wishlistItems.some(
            (item) => String(item.productId || item.product || item._id) === String(productId)
          );
          setIsFavorite(exists);
        }
      } catch (error) {
        console.error('Error al comprobar el estado de favorito:', error);
      }
    };

    if (productId) {
      checkFavoriteStatus();
    }
  }, [productId]);

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    try {
      // Como tu backend hace un toggle con el POST, podemos llamar a la función de añadir o usar el toggle directo.
      // Dependiendo de tu servicio, si addToWishlist usa POST /api/wishlist/:productId, el backend alternará solo.
      // O si prefieres usar explícitamente el estado local:
      if (isFavorite) {
        await removeFromWishlist(productId);
        setIsFavorite(false);
      } else {
        await addToWishlist(productId);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error al actualizar la wishlist:', error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        alert('Debes iniciar sesión para gestionar tu lista de deseos.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggleWishlist} 
      disabled={loading}
      className={`${styles.wishlistBtn} ${isFavorite ? styles.active : ''}`}
      title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
      aria-label="Botón de lista de deseos"
    >
      {isFavorite ? '❤️' : '🤍'}
    </button>
  );
}