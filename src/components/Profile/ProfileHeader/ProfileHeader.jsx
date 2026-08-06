import styles from './ProfileHeader.module.css';

export default function ProfileHeader({
    name,
    email,
    profileImage,
    favoriteGenre,
    favoriteMovie,
    favoriteDirector,
}) {
  const initial =
    name?.charAt(0).toUpperCase() || 'U';

  return (
    <section className={styles.header}>
      <div className={styles.avatarWrapper}>
        {profileImage ? (
          <img
            src={profileImage}
            alt={`Foto de perfil de ${name}`}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {initial}
          </div>
        )}
      </div>

      <div className={styles.info}>
        <h1 className={styles.name}>
          {name || 'Usuario'}
        </h1>

        <p className={styles.email}>
          {email}
        </p>
       
        {(favoriteGenre || favoriteMovie || favoriteDirector) && (

          <div className={styles.tags}>

              {favoriteGenre && (
                  <span className={styles.tag}>
                      🎭 {favoriteGenre}
                  </span>
              )}

              {favoriteMovie && (
                  <span className={styles.tag}>
                      🎬 {favoriteMovie}
                  </span>
              )}

              {favoriteDirector && (
                  <span className={styles.tag}>
                      🎥 {favoriteDirector}
                  </span>
              )}

          </div>

      )}

      </div>
    </section>
  );
}