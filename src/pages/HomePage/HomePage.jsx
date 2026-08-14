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
  const featuredProducts = products.slice(0, 6);
  const spotlight = products[0];

  return (
    <main className={styles.home}>

      {/* HERO — con forma de entrada de cine */}
      <section className={styles.ticket}>
        <div className={styles.stamp}>ADMIT ONE</div>

        <div className={styles.ticketPoster}>
          {spotlight?.imageUrl ? (
            <img
              src={spotlight.imageUrl}
              alt={spotlight.name}
              className={styles.posterImage}
            />
          ) : (
            <div className={styles.posterPlaceholder}>🎞️</div>
          )}
        </div>

        <div className={styles.perforation} aria-hidden="true" />

        <div className={styles.ticketInfo}>
          <span className={styles.eyebrow}>
            Atxurre CineClub · Admit One
          </span>

          <h1>Una butaca reservada para tu próxima obsesión</h1>

          <p>
            Selecciona título, deja tu valoración y construye la colección
            que te representa. Sin anuncios entre escenas.
          </p>

          <div className={styles.ticketMeta}>
            <span>SESIÓN: SIEMPRE ABIERTA</span>
            <span>SALA: TU CATÁLOGO</span>
            <span>DURACIÓN: LA QUE QUIERAS</span>
          </div>

          <Link to="/products" className={styles.button}>
            Ver la cartelera completa
          </Link>
        </div>
      </section>

      {/* DESTACADOS */}
      <section className={styles.featured}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.marqueeLabel}>En cartelera esta semana</span>
            <h2>Películas destacadas</h2>
          </div>
          <Link to="/products" className={styles.moreLink}>
            Ver todas →
          </Link>
        </div>

        <ProductGrid products={featuredProducts} />
      </section>

      {/* SALAS DEL CLUB */}
      <section className={styles.rooms}>
        <div className={styles.room}>
          <span className={styles.roomTag}>Sala 1</span>
          <h3>Selección</h3>
          <p>
            Un catálogo comisariado por cinéfilos, no por un algoritmo de
            recomendación.
          </p>
        </div>

        <div className={styles.room}>
          <span className={styles.roomTag}>Sala 2</span>
          <h3>Crítica</h3>
          <p>
            Valoraciones reales de gente que ya ha visto la función, no
            estrellas compradas.
          </p>
        </div>

        <div className={styles.room}>
          <span className={styles.roomTag}>Sala 3</span>
          <h3>Club</h3>
          <p>
            Tu perfil, tu historial y una comunidad que también mira el
            cine con atención.
          </p>
        </div>
      </section>

      {/* CTA FINAL — marquesina */}
      <section className={styles.cta}>
        <span className={styles.marqueeLabel}>Próxima sesión</span>
        <h2>¿Qué vas a poner esta noche?</h2>
        <p>
          Explora el catálogo y encuentra la película con la que vas a
          quedarte.
        </p>
        <Link to="/products" className={styles.button}>
          Ver el catálogo
        </Link>
      </section>

    </main>
  );
}