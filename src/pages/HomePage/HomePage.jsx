import { MOCK_PRODUCTS } from '../../data/mockProducts';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import { Link } from 'react-router-dom';

export default function HomePage() {
  // Tomamos los primeros 3 productos para mostrarlos como destacados
  const featuredProducts = MOCK_PRODUCTS.slice(0, 3);

  return (
    <div>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1>Bienvenido a MiTienda</h1>
        <p style={{ color: 'var(--text-light)', margin: '0.5rem 0 1.5rem' }}>
          Descubre nuestra selección de productos exclusivos.
        </p>
        <Link
          to="/products"
          style={{
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            fontWeight: 'bold'
          }}
        >
          Ver todo el catálogo
        </Link>
      </div>

      <h2>Productos Destacados</h2>
      <ProductGrid products={featuredProducts} />
    </div>
  );
}