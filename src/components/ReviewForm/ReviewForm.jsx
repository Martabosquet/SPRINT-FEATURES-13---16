import { useState } from 'react';
import api from '../../api/axios';
import Button from '../Button/Button';
import styles from './ReviewForm.module.css';

export default function ReviewForm({ productId, onReviewAdded }) {
  const [rating, setRating] = useState(8);
  const [comment, setComment] = useState('');
  
  // 🟢 Nuevo estado para la fecha de visualización (por defecto la fecha actual en formato YYYY-MM-DD)
  const [fechaDeVisualizacion, setFechaDeVisualizacion] = useState(
    new Date().toISOString().split('T')[0]
  );
  
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

    if (!fechaDeVisualizacion) {
      setError('Debes indicar la fecha en que viste la película.');
      return;
    }

    const currentUserName = localStorage.getItem('userName') || 'Usuario Anónimo';

    setSubmitting(true);
    setError('');

    try {
      // 🟢 Enviamos el payload exacto que espera tu backend/Postman
      const response = await api.post(`/api/products/${productId}/reviews`, {
        rating: numericRating,
        comment,
        fechaDeVisualizacion,
        userName: currentUserName,
      });

      setComment('');
      setRating(8);
      setFechaDeVisualizacion(new Date().toISOString().split('T')[0]);

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
          step="0.5"
          value={rating} 
          onChange={(e) => setRating(e.target.value)}
          className={styles.inputNumber}
        />
      </div>

      {/* 🟢 Nuevo campo de fecha */}
      <div className={styles.field}>
        <label htmlFor="fechaDeVisualizacion">¿Qué día la viste?:</label>
        <input 
          id="fechaDeVisualizacion"
          type="date"
          value={fechaDeVisualizacion}
          onChange={(e) => setFechaDeVisualizacion(e.target.value)}
          className={styles.inputDate}
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