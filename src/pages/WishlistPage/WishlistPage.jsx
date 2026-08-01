import { useEffect, useState } from 'react';
import apiClient from '../../api/axios'; // Instancia de Axios
import ProductCard from '../../components/ProductCard/ProductCard'; // 🟢 Importamos tu tarjeta de producto
import styles from './WishlistPage.module.css';

export default function WishlistPage() {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWishlistWithProducts = async () => {
      try {
        // 1. Obtenemos los elementos de la wishlist del usuario
        const response = await apiClient.get('/api/wishlist');
        const items = response.data.data || [];

        // 2. Para cada elemento de la wishlist, obtenemos los detalles completos del producto 
        // (asumiendo que tu backend tiene una ruta GET /api/products/:id)
        const productPromises = items.map(async (item) => {
          const prodId = item.productId || item.product;
          const prodResponse = await apiClient.get(`/api/products/${prodId}`);
          return prodResponse.data.data || prodResponse.data;
        });

        const products = await Promise.all(productPromises);
        setWishlistProducts(products);
      } catch (err) {
        console.error('Error al cargar los productos de la wishlist:', err);
        setError('No se pudo cargar tu lista de deseos.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistWithProducts();
  }, []);

  if (loading) return <p className={styles.message}>Cargando tu lista de deseos...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h2>Mi Lista de Deseos</h2>

      {wishlistProducts.length === 0 ? (
        <p className={styles.message}>Aún no tienes productos guardados en tu lista de deseos.</p>
      ) : (
        <div className={styles.grid}>
          {wishlistProducts.map((product) => {
            const prodId = product.id || product._id;
            return (
              <div key={prodId}>
                {/* 🟢 Pintamos directamente tu ProductCard reutilizando el componente */}
                <ProductCard product={product} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}