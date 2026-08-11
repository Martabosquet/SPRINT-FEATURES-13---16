import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import { authStorage, clearSession, notifyAuthChange } from '../../utils/authStorage';
import { logout as logoutRequest } from '../../api/auth';
import { logout as logoutAction } from '../../store/authSlice';

import styles from './Header.module.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState(authStorage.userName);
  const [userProfileImage, setUserProfileImage] = useState(authStorage.userProfileImage);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(
    (state) => state.cart.items
  );
  const totalItems = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity ?? 0),
    0
  );
  useEffect(() => {
    const syncAuth = () => {
      setUserName(authStorage.userName);
      setUserProfileImage(authStorage.userProfileImage);
    };
    window.addEventListener(
      'authChange',
      syncAuth
    );
    window.addEventListener(
      'storage',
      syncAuth
    );
    return () => {
      window.removeEventListener(
        'authChange',
        syncAuth
      );
      window.removeEventListener(
        'storage',
        syncAuth
      );
    };
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
    clearSession();
    dispatch(logoutAction()); // limpia también el estado de Redux
    notifyAuthChange();
    closeMenu();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link
          to="/"
          className={styles.logo}
          onClick={closeMenu}
        >
          🎬 Atxurre CineClub
        </Link>
        <button
          className={styles.menuToggle}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir menú"
        >
          ☰
        </button>
        <nav
          className={`${styles.nav} ${isOpen ? styles.open : ''
            }`}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? `${styles.link} ${styles.active}`
                : styles.link
            }
            onClick={closeMenu}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? `${styles.link} ${styles.active}`
                : styles.link
            }
            onClick={closeMenu}
          >
            Películas
          </NavLink>
          {userName && (
            <NavLink
              to="/wishlist"
              className={styles.link}
              onClick={closeMenu}
            >
              ❤️
            </NavLink>
          )}
          {userName && (
            <div className={styles.cart}>
              <Link
                to="/cart"
                className={styles.iconButton}
                onClick={closeMenu}
              >
                🛒
              </Link>

              {totalItems > 0 && (
                <span className={styles.badge}>
                  {totalItems}
                </span>
              )}
            </div>
          )}
          {userName ? (
            <div className={styles.user}>
              <Link
                to="/profile"
                onClick={closeMenu}
              >
                <div className={styles.avatar}>
                  {
                    userProfileImage
                      ?
                      <img
                        src={userProfileImage}
                        alt="Perfil"
                      />
                      :
                      userName
                        .charAt(0)
                        .toUpperCase()
                  }
                </div>
              </Link>
              <Link
                to="/profile"
                className={styles.userName}
                onClick={closeMenu}
              >
                {userName}
              </Link>
              <button
                className={styles.logout}
                onClick={handleLogout}
              >
                Salir
              </button>
            </div>
          )
            :
            (
              <NavLink
                to="/login"
                className={styles.login}
                onClick={closeMenu}
              >
                Entrar
              </NavLink>
            )
          }
        </nav>
      </div>
    </header>
  );
}