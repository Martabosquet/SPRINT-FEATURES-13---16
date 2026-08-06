import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import styles from './ReviewList.module.css';

export default function ReviewList({ reviews, loading, error }) {
  if (loading) {
    return <p className={styles.message}>Cargando valoraciones...</p>;
  }

  if (error) {
    return <p className={styles.error}>No se pudieron cargar las valoraciones.</p>;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <p className={styles.message}>
        Este producto aún no tiene valoraciones. ¡Sé el primero!
      </p>
    );
  }

  return (
    <ul className={styles.list}>
      {reviews.map((review) => {
        const reviewId = review.id || review._id;

        const reviewerName =
          review.userName ||
          review.user?.name ||
          review.username ||
          'Usuario Anónimo';

        return (
          <li key={reviewId} className={styles.reviewCard}>
            <div className={styles.header}>
              <div>
                <p className={styles.author}>
                  {review.userId ? (
                    <Link
                      to={`/profile/${review.userId}`}
                      className={styles.reviewerLink}
                    >
                      {reviewerName}
                    </Link>
                  ) : (
                    // Si por lo que sea no hay userId (reviews antiguas, datos sueltos),
                    // mostramos el nombre como texto plano en vez de un link roto
                    <span>{reviewerName}</span>
                  )}
                </p>

                {review.fechaDeVisualizacion && (
                  <p className={styles.date}>
                    🎬 Vista el {review.fechaDeVisualizacion}
                  </p>
                )}
              </div>

              <div className={styles.rating}>
                <StarRating rating={review.rating} maxRating={10} />
              </div>
            </div>

            <p className={styles.comment}>
              {review.comment}
            </p>
          </li>
        );
      })}
    </ul>
  );
}