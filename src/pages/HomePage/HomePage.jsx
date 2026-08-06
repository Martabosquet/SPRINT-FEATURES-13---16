import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const {
    data: products,
    loading,
    error
  } = useProducts();
  if (loading) {
    return (
      <p className={styles.message}>
        Cargando catálogo...
      </p>
    );
  }
  if (error) {
    return (
      <p className={styles.error}>
        {error}
      </p>
    );
  }
  /*
    Mostramos una selección inicial.
    Más adelante podemos sustituir esto por:
    - más valoradas
    - novedades
    - recomendadas
  */
  const featuredProducts =
    products.slice(0, 6);
  return (
    <main className={styles.home}>
      {/* HERO PRINCIPAL */}
      <section className={styles.hero}>
        <span className={styles.eyebrow}>
          🎬 ATXURRE CINECLUB
        </span>
        <h1>
          El cine que merece
          quedarse contigo
        </h1>
        <p>
          Descubre películas seleccionadas,
          comparte tus opiniones y crea tu
          propia colección cinematográfica.
        </p>
        <Link
          to="/products"
          className={styles.button}
        >
          Explorar películas
        </Link>
      </section>
      {/* DESTACADOS */}
      <section className={styles.featured}>
        <div className={styles.sectionHeader}>
          <h2>
            Películas destacadas
          </h2>
          <Link
            to="/products"
            className={styles.moreLink}
          >
            Ver todas →
          </Link>
        </div>
        <ProductGrid
          products={featuredProducts}
        />
      </section>
      {/* FILOSOFÍA DEL CLUB */}
      <section className={styles.features}>
        <article>
          <span>
            🎞️
          </span>
          <h3>
            Cine seleccionado
          </h3>
          <p>
            Una colección cuidada para
            quienes disfrutan descubriendo
            grandes historias.
          </p>
        </article>
        <article>
          <span>
            ⭐
          </span>
          <h3>
            Opiniones reales
          </h3>
          <p>
            Valora películas, comparte
            experiencias y descubre nuevas
            recomendaciones.
          </p>
        </article>
        <article>
          <span>
            🤝
          </span>
          <h3>
            Comunidad cinéfila
          </h3>
          <p>
            Un espacio para amantes del cine
            y coleccionistas.
          </p>
        </article>
      </section>
      {/* CTA FINAL */}
      <section className={styles.cta}>
        <h2>
          ¿Preparado para tu próxima película?
        </h2>
        <p>
          Explora nuestro catálogo y encuentra
          tu próxima historia favorita.
        </p>
        <Link
          to="/products"
          className={styles.button}
        >
          Ver películas
        </Link>
      </section>
    </main>
  );
}