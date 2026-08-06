import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicProfile } from '../../api/auth';
import styles from './PublicProfilePage.module.css';

export default function PublicProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getPublicProfile(userId);
        const userData = data?.data;

        if (userData) {
          setUser(userData);
        } else {
          setError('Los datos del usuario no están disponibles.');
        }
      } catch (err) {
        console.error('Error al cargar el perfil público:', err);
        setError('No se pudo cargar el perfil de este usuario.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPublicProfile();
    }
  }, [userId]);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  if (loading) {
    return (
      <main className={styles.container}>
        <p className={styles.centeredMessage}>Cargando ficha del cinéfilo...</p>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className={styles.container}>
        <div className={styles.centeredContainer}>
          <h2>{error || 'Usuario no encontrado'}</h2>
          <button onClick={() => navigate('/products')} className={styles.backButton}>
            ← Volver al catálogo
          </button>
        </div>
      </main>
    );
  }

  const favorites = [
    { label: 'Película favorita', value: user.favoriteMovie },
    { label: 'Director favorito', value: user.favoriteDirector },
    { label: 'Género favorito', value: user.favoriteGenre },
  ].filter((fav) => fav.value);

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        {/* Cabecera tipo carné de socio */}
        <div className={styles.header}>
          <div className={styles.avatarWrapper}>
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.name} className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>

          <div className={styles.headerInfo}>
            <span className={styles.eyebrow}>Ficha de socio</span>
            <h1 className={styles.name}>{user.name}</h1>
            {memberSince && (
              <p className={styles.memberSince}>Miembro desde {memberSince}</p>
            )}
          </div>
        </div>

        {user.bio && (
          <p className={styles.bio}>&ldquo;{user.bio}&rdquo;</p>
        )}

        {/* Favoritos como fichas de póster */}
        {favorites.length > 0 && (
          <section className={styles.favoritesSection}>
            <h2 className={styles.sectionTitle}>Su cineteca personal</h2>
            <div className={styles.favoritesGrid}>
              {favorites.map((fav) => (
                <div key={fav.label} className={styles.favoriteCard}>
                  <span className={styles.favoriteLabel}>{fav.label}</span>
                  <span className={styles.favoriteValue}>{fav.value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <button onClick={() => navigate('/products')} className={styles.backButton}>
          ← Volver al catálogo
        </button>
      </div>
    </main>
  );
}