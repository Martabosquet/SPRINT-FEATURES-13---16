import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles['header-container']}>
        <Link to="/" className={styles.logo} onClick={() => setIsOpen(false)}>
          MiTienda
        </Link>

        {/* Botón de menú móvil */}
        <button 
          className={styles['menu-toggle']} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
        >
          ☰
        </button>

        {/* Enlaces de navegación */}
        <nav className={`${styles['nav-menu']} ${isOpen ? styles.open : ''}`}>
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive ? `${styles['nav-link']} ${styles.active}` : styles['nav-link']
            }
            onClick={() => setIsOpen(false)}
          >
            Inicio
          </NavLink>
          <NavLink 
            to="/products" 
            className={({ isActive }) => 
              isActive ? `${styles['nav-link']} ${styles.active}` : styles['nav-link']
            }
            onClick={() => setIsOpen(false)}
          >
            Catálogo
          </NavLink>
        </nav>
      </div>
    </header>
  );
}