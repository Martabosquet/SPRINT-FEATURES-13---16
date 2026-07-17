import { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import styles from './ProductsPage.module.css';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Llamamos a nuestro hook de productos reales
  const { data: products, loading, error } = useProducts();

  // Gestión visual de estados asíncronos (Exigido en las instrucciones)
  if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando catálogo...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red', padding: '2rem' }}>{error}</p>;

  // Filtramos los productos reales según lo que escriba el usuario en el input
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1>Catálogo de Productos Reales</h1>
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.search}
      />

      {/* Si hay coincidencias las pintamos, si no, mostramos aviso */}
      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <p className={styles['no-results']}>No se encontraron productos.</p>
      )}
    </div>
  );
}