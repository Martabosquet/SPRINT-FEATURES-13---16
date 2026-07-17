import { useState } from 'react';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import styles from './ProductsPage.module.css';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtramos los productos según lo que escriba el usuario en tiempo real
  const filteredProducts = MOCK_PRODUCTS.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1>Catálogo de Productos</h1>
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.search}
      />

      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <p className={styles['no-results']}>No se encontraron productos que coincidan con tu búsqueda.</p>
      )}
    </div>
  );
}