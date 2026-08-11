import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProduct } from '../../api/products';
import FormInput from '../../components/FormInput/FormInput';
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

  const [formErrors, setFormErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const validate = () => {
    const errors = {};

    if (!form.name.trim()) {
      errors.name = 'El nombre del producto es obligatorio.';
    } else if (form.name.trim().length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres.';
    }

    if (!form.price) {
      errors.price = 'El precio es obligatorio.';
    } else if (Number(form.price) <= 0) {
      errors.price = 'El precio debe ser mayor que 0.';
    }

    if (!form.stock && form.stock !== 0) {
      errors.stock = 'El stock es obligatorio.';
    } else if (Number(form.stock) < 0) {
      errors.stock = 'El stock no puede ser negativo.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', form.name.trim());
      formData.append('price', Number(form.price));
      formData.append('stock', Number(form.stock));
      formData.append('description', form.description.trim());

      if (imageFile) {
        formData.append('image', imageFile);
      }

      await createProduct(formData);
      navigate('/products');
    } catch (err) {
      console.error(err);
      setError('No se pudo crear el producto. Comprueba los datos o la conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Añadir Nuevo Producto (Admin)</h2>

      {error && <p className={styles.errorText}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data" noValidate>
        <FormInput
          label="Nombre del producto"
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          error={formErrors.name}
          autoFocus
          placeholder="Ej. Espada Láser"
        />

        <FormInput
          label="Precio (€)"
          id="price"
          name="price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          error={formErrors.price}
          placeholder="0.00"
        />

        <FormInput
          label="Stock disponible"
          id="stock"
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          error={formErrors.stock}
          placeholder="0"
        />

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
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className={styles.textarea}
            placeholder="Escribe una breve descripción..."
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