import { Link } from "react-router-dom"
import styles from "./Footer.module.css"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <section>
          <h3 className={styles.title}>⚽ Bakio Atxurre</h3>

          <p className={styles.text}>
            Tienda oficial del club.
          </p>

          <p className={styles.text}>
            Merchandising oficial para jugadores, familias y aficionados.
          </p>
        </section>

        <section>
          <h3 className={styles.title}>Compra con confianza</h3>

          <p className={styles.text}>
            🚚 Entrega gratuita en Bakio.
          </p>

          <p className={styles.text}>
            🤝 Nos pondremos en contacto contigo para acordar la entrega.
          </p>

          <p className={styles.text}>
            🔒 Pago seguro.
          </p>
        </section>

        <section>
          <h3 className={styles.title}>Contacto</h3>

          <a
            href="mailto:tienda@bakioatxurre.eus"
            className={styles.link}
          >
            tienda@bakioatxurre.eus
          </a>

          <a
            href="https://instagram.com/bakioatxurre"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            Instagram
          </a>

          <p className={styles.text}>
            📍 Bakio (Bizkaia)
          </p>
        </section>
      </div>

      <div className={styles.bottom}>
        <p>© {year} Bakio Atxurre. Todos los derechos reservados.</p>

        <div className={styles.legal}>
          <Link to="/privacidad">Privacidad</Link>
          <Link to="/cookies">Cookies</Link>
          <Link to="/aviso-legal">Aviso legal</Link>
        </div>
      </div>
    </footer>
  )
}