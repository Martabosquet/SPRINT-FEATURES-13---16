import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  // Guardamos el nombre del usuario logueado (o null si no hay sesión)
  const [userName, setUserName] = useState(localStorage.getItem('userName'));
  const navigate = useNavigate();

  useEffect(() => {
    // Vuelve a leer localStorage cuando cambia el estado de sesión (login/logout)
    const syncAuth = () => {
      setUserName(localStorage.getItem('userName'));
    };

    window.addEventListener('authChange', syncAuth);
    // Por si el usuario cierra sesión en otra pestaña
    window.addEventListener('storage', syncAuth);

    return () => {
      window.removeEventListener('authChange', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.dispatchEvent(new Event('authChange'));
    setIsOpen(false);
    navigate('/');
  };

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

          {/* A partir de aquí cambia según si hay sesión iniciada o no */}
          {userName ? (
            <div className={styles['user-area']}>
              <span className={styles.greeting}>Hola, {userName}</span>
              <button onClick={handleLogout} className={styles['logout-btn']}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? `${styles['inicio-link']} ${styles.active}` : styles['inicio-link']
              }
              onClick={() => setIsOpen(false)}
              style={{ marginRight: '0.5rem' }}
            >
              Iniciar sesión
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}