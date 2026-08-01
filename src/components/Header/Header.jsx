import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"; 
import { clearCart } from "../../store/cartSlice"; 
import styles from './Header.module.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('userName'));
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  
  const cartItems = useSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity ?? 0),
    0,
  );

  // Efecto para sincronizar el estado de autenticación (nombre de usuario) ante cambios en storage o eventos personalizados
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

  // Función para cerrar sesión limpiando localStorage y redirigiendo al home
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
        {/* Logo que redirige al inicio */}
        <Link to="/" className={styles.logo} onClick={() => setIsOpen(false)}>
          MiTienda
        </Link>

        {/* Botón de menú responsive para dispositivos móviles */}
        <button
          className={styles['menu-toggle']}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
        >
          ☰
        </button>

        {/* Enlaces de navegación principales */}
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

          {/* 🟢 NUEVO: Enlace a la Wishlist (visible solo si el usuario ha iniciado sesión) */}
          {userName && (
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                isActive ? `${styles['nav-link']} ${styles.active}` : styles['nav-link']
              }
              onClick={() => setIsOpen(false)}
            >
            ❤️
            </NavLink>
          )}

          {/* Área de control de sesión (Usuario / Iniciar sesión) */}
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

          {/* Sección del carrito de compras y su indicador numérico */}
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