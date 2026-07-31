import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import styles from './Header.module.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('userName'));
  const navigate = useNavigate();
  
  const cartItems = useSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity ?? 0),
    0,
  );

  useEffect(() => {
      const syncAuth = () => {
        setUserName(localStorage.getItem('userName'));
      };

      // Escuchamos nuestro evento personalizado
      window.addEventListener('authChange', syncAuth);
      // Escuchamos cambios de storage por si acaso
      window.addEventListener('storage', syncAuth);

      // Ejecutamos una comprobación inicial al montar por seguridad
      syncAuth();

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

          {/* Área de usuario */}
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

          {/* Carrito y bolita roja condicionados a que EXISTA SESIÓN Y HAYA ITEMS */}
          {userName && (
            <div className={styles['cart-area']}>
              <Link className={styles.link} to="/cart" onClick={() => setIsOpen(false)}>
                Carrito
              </Link>
              
              {/* La bolita roja solo se muestra si hay sesión iniciada Y totalItems > 0 */}
              {totalItems > 0 && (
                <div className={styles.status}>
                  <span className={styles.badge}>{totalItems}</span>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}