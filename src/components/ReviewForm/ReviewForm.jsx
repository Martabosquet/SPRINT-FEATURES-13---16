import { useState } from 'react';
import api from '../../api/axios';
import { authStorage } from '../../utils/authStorage';
import Button from '../Button/Button';
import styles from './ReviewForm.module.css';

export default function ReviewForm({ productId, onReviewAdded }) {
  const [rating, setRating] = useState(8);
  const [comment, setComment] = useState('');
  const [fechaDeVisualizacion, setFechaDeVisualizacion] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericRating = Number(rating);

    if (
      Number.isNaN(numericRating) ||
      numericRating < 0 ||
      numericRating > 10
    ) {
      setError('La nota debe estar entre 0 y 10.');
      return;
    }

    if (!comment.trim()) {
      setError('El comentario no puede estar vacío.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const userName =
        authStorage.userName ||
        'Usuario Anónimo';

      const response = await api.post(
        `/api/products/${productId}/reviews`,
        {
          rating: numericRating,
          comment,
          fechaDeVisualizacion,
          userName,
        }
      );

      setRating(8);
      setComment('');
      setFechaDeVisualizacion(
        new Date().toISOString().split('T')[0]
      );

      if (onReviewAdded) {
        onReviewAdded(response.data);
      }
    } catch (err) {
      console.error(
        'Error al enviar valoración:',
        err
      );

      setError(
        'No se pudo enviar la valoración.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form}
    >
      <h3>
        Escribe tu valoración
      </h3>

      <div className={styles.field}>
        <label htmlFor="rating">
          Nota (0-10)
        </label>

        <input
          id="rating"
          type="number"
          min="0"
          max="10"
          step="0.5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="fecha">
          ¿Qué día viste la película?
        </label>

        <input
          id="fecha"
          type="date"
          value={fechaDeVisualizacion}
          onChange={(e) =>
            setFechaDeVisualizacion(e.target.value)
          }
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="comment">
          Comentario
        </label>

        <textarea
          id="comment"
          rows="4"
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
          placeholder="¿Qué te ha parecido?"
          className={styles.textarea}
        />
      </div>

      {error && (
        <p className={styles.error}>
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        disabled={submitting}
      >
        {submitting
          ? 'Enviando...'
          : 'Publicar valoración'}
      </Button>
    </form>
  );
}