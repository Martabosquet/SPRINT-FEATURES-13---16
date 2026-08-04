import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProduct } from '../../api/products';
import styles from './CreateProductPage.module.css';

export default function CreateProductPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
  });

  // Estado separado para almacenar el archivo de imagen seleccionado
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manejador específico para el archivo
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Como vamos a enviar un archivo junto a los datos, 
      // lo correcto es empaquetarlo todo en un FormData para Cloudinary / Multer
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', Number(form.price));
      formData.append('stock', Number(form.stock));
      formData.append('description', form.description);
      
      if (imageFile) {
        formData.append('image', imageFile); // 'image' debe coincidir con el nombre que espera tu backend (ej: upload.single('image'))
      }

      // Pasamos el formData a tu función de la api
      await createProduct(formData);

      navigate('/products');
    } catch (err) {
      console.error(err);
      setError('No se pudo crear el producto. Comprueba los datos o la imagen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Añadir Nuevo Producto (Admin)</h2>
      
      {error && <p className={styles.errorText}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
        <div className={styles.field}>
          <label>Nombre del producto</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label>Precio (€)</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label>Stock disponible</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        {/* Input cambiado a tipo file para conectar con Cloudinary */}
        <div className={styles.field}>
          <label>Imagen del producto (Subir archivo)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.input}
            style={{ padding: '0.5rem' }}
          />
          {imageFile && <small style={{ color: '#666' }}>Archivo seleccionado: {imageFile.name}</small>}
        </div>

        <div className={styles.field}>
          <label>Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className={styles.textarea}
          />
        </div>

        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? 'Subiendo a Cloudinary...' : 'Crear Producto'}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem' }}>
        <Link to="/products" className={styles.backLink}>&larr; Volver al catálogo</Link>
      </div>
    </div>
  );
}