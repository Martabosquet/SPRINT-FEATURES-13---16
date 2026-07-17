import { useProducts } from '../../hooks/useProducts';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import { Link } from 'react-router-dom';

export default function HomePage() {
  // Consumimos el hook que creamos en el paso anterior
  const { data: products, loading, error } = useProducts();

  // Si la petición a la API sigue en curso, mostramos mensaje de carga
  if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando productos destacados...</p>;

  // Si la API falla o el servidor está apagado, mostramos el error
  if (error) return <p style={{ textAlign: 'center', color: 'red', padding: '2rem' }}>{error}</p>;

  // Si todo está correcto, tomamos los 3 primeros productos de la base de datos real
  const featuredProducts = products.slice(0, 3);

  return (
    <div>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1>Bienvenido a MiTienda Real</h1>
        <p style={{ color: 'var(--text-light)', margin: '0.5rem 0 1.5rem' }}>
          Descubre nuestra selección conectada a base de datos.
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
      {/* Pasamos los productos reales al grid mediante props */}
      <ProductGrid products={featuredProducts} />
    </div>
  );
}