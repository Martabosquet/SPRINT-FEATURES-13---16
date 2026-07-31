import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"; // 1. Añadimos useDispatch
import { clearCart } from "../../store/cartSlice"; // 2. Importamos clearCart (ajusta la ruta según tu estructura)
import styles from './Header.module.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('userName'));
  const navigate = useNavigate();
  const dispatch = useDispatch(); // 3. Inicializamos dispatch
  
  const cartItems = useSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity ?? 0),
    0,
  );

  useEffect(() => {
      const syncAuth = () => {
        setUserName(localStorage.getItem('userName'));
      };

      window.addEventListener('authChange', syncAuth);
      window.addEventListener('storage', syncAuth);
      syncAuth();

      return () => {
        window.removeEventListener('authChange', syncAuth);
        window.removeEventListener('storage', syncAuth);
      };
    }, []);

const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    
    // NO vaciamos el carrito con clearCart(), así cuando el usuario vuelva a entrar, si el backend lo tiene guardado, lo recuperará.
    
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

          {/* Carrito y bolita roja */}
          {userName && (
            <div className={styles['cart-area']}>
              <Link className={styles.link} to="/cart" onClick={() => setIsOpen(false)}>
                Carrito
              </Link>
              
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