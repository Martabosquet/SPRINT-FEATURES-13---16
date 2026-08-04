import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"; 
import { clearCart } from "../../store/cartSlice"; 
import styles from './Header.module.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('userName'));
  const [userProfileImage, setUserProfileImage] = useState(localStorage.getItem('userProfileImage'));
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  
  const cartItems = useSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity ?? 0),
    0,
  );

  // Efecto para sincronizar el estado de autenticación y datos de usuario
  useEffect(() => {
      const syncAuth = () => {
        setUserName(localStorage.getItem('userName'));
        setUserProfileImage(localStorage.getItem('userProfileImage'));
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
    localStorage.removeItem('userProfileImage');
    
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

          {/* Enlace a la Wishlist (visible solo si el usuario ha iniciado sesión) */}
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

          {/* 🛒 Carrito reubicado justo a la derecha del corazón (visible si hay sesión) */}
          {userName && (
            <div className={styles['cart-area']}>
              <Link className={styles.link} to="/cart" onClick={() => setIsOpen(false)}>
                🛒
              </Link>
              
              {totalItems > 0 && (
                <div className={styles.status}>
                  <span className={styles.badge}>{totalItems}</span>
                </div>
              )}
            </div>
          )}

          {/* Área de control de sesión (Usuario / Iniciar sesión) */}
          {userName ? (
            <div className={styles['user-area']}>
              {/* 🟢 Círculo con la foto de perfil (o inicial por defecto) a la izquierda del saludo */}
              <Link 
                to="/profile" 
                onClick={() => setIsOpen(false)}
                style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: '#ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.5rem',
                  border: '1px solid #ddd'
                }}>
                  {userProfileImage ? (
                    <img src={userProfileImage} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '14px', color: '#fff', fontWeight: 'bold' }}>
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </Link>

              {/* Saludo navegable hacia /profile */}
              <Link 
                to="/profile" 
                className={styles.greeting} 
                onClick={() => setIsOpen(false)}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Hola, {userName}
              </Link>
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