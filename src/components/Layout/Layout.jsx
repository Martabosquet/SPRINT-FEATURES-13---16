import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './Layout.module.css';

export default function Layout() {
  return (
    <div className={styles['layout-container']}>
      <Header />
      <main className={styles['main-content']}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}