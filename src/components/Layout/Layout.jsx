import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './Layout.module.css';

// El componente Layout sirve como plantilla estructural común para toda la aplicación.
// En lugar de repetir Header y Footer en cada página, este componente define el esqueleto principal.
export default function Layout() {
  return (
    <div className={styles['layout-container']}>
      {/* Cabecera común con navegación */}
      <Header />
      
      <main className={styles['main-content']}>
        {/* 
          <Outlet /> es un componente especial de React Router.
          Funciona como un marcador de posición (placeholder) que renderizará el componente
          de la ruta activa secundaria (hija) que se haya configurado en el enrutador
          (por ejemplo, HomePage, ProductsPage o ProductDetailPage).
        */}
        <Outlet />
      </main>
      
      {/* Pie de página común */}
      <Footer />
    </div>
  );
}