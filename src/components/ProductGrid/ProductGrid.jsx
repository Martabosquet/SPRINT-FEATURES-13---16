import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductGrid.module.css';

export default function ProductGrid({ products }) {  //se recibe la lista de productos y la pinta en una cuadrícula (grid)
  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}