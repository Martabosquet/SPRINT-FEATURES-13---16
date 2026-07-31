import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

function NotFoundPage() {
  return (
    <main className={styles.page}>
      <p className={styles.code}>404</p>
      <h2 className={styles.title}>Pagina no encontrada</h2>
      <Link className={styles.link} to="/">
        Volver a productos
      </Link>
    </main>
  );
}

export default NotFoundPage;