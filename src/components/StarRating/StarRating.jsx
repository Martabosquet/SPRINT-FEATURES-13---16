import styles from './StarRating.module.css';

export default function StarRating({
  rating = 0,
  maxRating = 10,
  size = 'medium',
}) {
  const safeRating = Math.min(
    maxRating,
    Math.max(0, Number(rating))
  );

  const fullStars = Math.round(safeRating);
  const emptyStars = maxRating - fullStars;

  return (
    <div
      className={`${styles.container} ${styles[size]}`}
      aria-label={`Valoración ${safeRating} de ${maxRating}`}
    >
      <span className={styles.stars}>
        {'★'.repeat(fullStars)}
        <span className={styles.empty}>
          {'☆'.repeat(emptyStars)}
        </span>
      </span>

      <span className={styles.score}>
        {safeRating}/{maxRating}
      </span>
    </div>
  );
}