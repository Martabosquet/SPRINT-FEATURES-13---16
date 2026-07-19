import StarRating from '../StarRating/StarRating';
import styles from './ReviewList.module.css';

export default function ReviewList({ reviews, loading, error }) {
    if (loading) return <p className={styles.message}>Cargando comentarios...</p>;

    if (error) return <p className={styles.error}>No se pudieron cargar las valoraciones.</p>;

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
                    review.user?.name || review.username || review.user || 'Usuario Anónimo';

                return (
                    <li key={reviewId} className={styles.reviewCard}>
                        <p className={styles.author}>{reviewerName}</p>
                        <StarRating rating={review.rating} maxRating={10} />
                        <p className={styles.comment}>{review.comment}</p>
                    </li>
                );
            })}
        </ul>
    );
}
