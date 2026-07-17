import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductGrid.module.css';

export default function ProductGrid({ products }) {
  return (
    <div className={styles.grid}>
      {products.map((product) => {

        const productId = product.id || product._id;  // Usamos product.id como identificador único para la directiva key de React (en MongoDB sería _id y supabase sin guion bajo)

        return (
          <ProductCard key={productId} product={product} />
        );
      })}
    </div>
  );
}