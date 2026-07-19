import styles from './StarRating.module.css';

// rating: puntuación obtenida (ej: 7)
// maxRating: puntuación máxima posible (ej: 10)
export default function StarRating({ rating, maxRating = 10 }) {
    const safeRating = Math.min(maxRating, Math.max(0, rating));
    const fullStars = safeRating;
    const emptyStars = maxRating - safeRating;

    return (
        <div className={styles.container}>
            <span className={styles.stars} aria-label={`Valoración: ${rating} de ${maxRating}`}>
                {'★'.repeat(fullStars)}
                <span className={styles.empty}>{'☆'.repeat(emptyStars)}</span>
            </span>
            <span className={styles.score}>({rating}/{maxRating})</span>
        </div>
    );
}
