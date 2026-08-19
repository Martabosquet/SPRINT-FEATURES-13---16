import { useMemo } from 'react';
import StarRating from '../StarRating/StarRating';
import styles from './RatingSummary.module.css';


export default function RatingSummary({ reviews = [] }) {

  const { totalReviews, averageRating, roundedAverage, ratingDistribution } = useMemo(() => {
    if (!reviews.length) {
      return { totalReviews: 0, averageRating: 0, roundedAverage: 0, ratingDistribution: [] };
    }

    const total = reviews.length;
    const avg = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / total;
    const rounded = Number(avg.toFixed(1));

    const distribution = Array.from({ length: 11 }, (_, index) => 10 - index).map((rating) => {
      const count = reviews.filter((review) => Math.round(Number(review.rating)) === rating).length;
      return { rating, count };
    });

    return {
      totalReviews: total,
      averageRating: avg,
      roundedAverage: rounded,
      ratingDistribution: distribution,
    };
  }, [reviews]);

  if (!reviews.length) {
    return (
      <section className={styles.empty}>
        <p>
          Este producto aún no tiene valoraciones.
        </p>
      </section>
    );
  }


  const getMessage = () => {

    if (roundedAverage >= 9) {
      return 'Valoraciones excelentes por parte de la comunidad.';
    }

    if (roundedAverage >= 8) {
      return 'Una de las películas favoritas de los usuarios.';
    }

    if (roundedAverage >= 7) {
      return 'Opiniones generalmente positivas.';
    }

    if (roundedAverage >= 6) {
      return 'Valoraciones bastante variadas.';
    }

    return 'La comunidad no ha quedado muy satisfecha.';
  };


  return (
    <section className={styles.container}>

      <div className={styles.mainRating}>

        <span className={styles.average}>
          {roundedAverage}
        </span>


        <StarRating
          rating={Math.round(roundedAverage)}
          maxRating={10}
          size="large"
        />


        <span className={styles.total}>
          {totalReviews} valoraciones
        </span>

      </div>



      <div className={styles.distribution}>

        {ratingDistribution.map((item) => {

          const percentage =
            totalReviews
              ? (item.count / totalReviews) * 100
              : 0;


          return (
            <div
              key={item.rating}
              className={styles.row}
            >

              <span>
                {item.rating} ★
              </span>


              <div className={styles.barBackground}>

                <div
                  className={styles.bar}
                  style={{
                    '--bar-width': `${percentage}%`,
                  }}
                />

              </div>


              <span className={styles.count}>
                {item.count}
              </span>

            </div>
          );

        })}

      </div>


      <p className={styles.message}>
        {getMessage()}
      </p>

    </section>
  );
}