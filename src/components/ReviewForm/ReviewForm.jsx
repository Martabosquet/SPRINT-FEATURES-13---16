import { useState } from 'react';
import api from '../../api/axios';
import Button from '../Button/Button';
import styles from './ReviewForm.module.css';

export default function ReviewForm({ productId, onReviewAdded }) {
  const [rating, setRating] = useState(8); // Valor por defecto inicial (ej: 8)
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 0 || numericRating > 10) {
      setError('La nota debe ser un número entre 0 y 10.');
      return;
    }

    if (!comment.trim()) {
      setError('El comentario no puede estar vacío.');
      return;
    }

    // Obtenemos el nombre actual del usuario del localStorage
    const currentUserName = localStorage.getItem('userName') || 'Usuario Anónimo';

    setSubmitting(true);
    setError('');

    try {
      const response = await api.post(`/api/products/${productId}/reviews`, {
        rating: numericRating,
        comment,
        userName: currentUserName, // 👈 Enviamos el nombre por si el backend lo requiere
      });

      setComment('');
      setRating(8);

      if (onReviewAdded) {
        onReviewAdded(response.data);
      }
    } catch (err) {
      console.error('Error al enviar la review:', err);
      setError('No se pudo enviar la valoración. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3>Escribe tu valoración</h3>

      <div className={styles.field}>
        <label htmlFor="rating">Nota (del 0 al 10):</label>
        <input 
          id="rating" 
          type="number"
          min="0"
          max="10"
          step="0.5" // Permite decimales como 8.5 (puedes cambiarlo a "1" si solo quieres números enteros)
          value={rating} 
          onChange={(e) => setRating(e.target.value)}
          className={styles.inputNumber}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="comment">Comentario:</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="¿Qué te ha parecido?"
          rows="4"
          className={styles.textarea}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <Button type="submit" variant="primary" disabled={submitting}>
        {submitting ? 'Enviando...' : 'Publicar valoración'}
      </Button>
    </form>
  );
}