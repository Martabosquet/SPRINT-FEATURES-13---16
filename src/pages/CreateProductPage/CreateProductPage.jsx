import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProduct } from '../../api/products';
import { validateProductForm } from '../../utils/validateProductForm';
import FormInput from '../../components/FormInput/FormInput';
import styles from './CreateProductPage.module.css';

export default function CreateProductPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
  });

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validateProductForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', Number(form.price));
      formData.append('stock', form.stock === '' ? 0 : Number(form.stock));
      formData.append('description', form.description);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      await createProduct(formData);

      navigate('/products');
    } catch (err) {
      console.error(err);
      setSubmitError(
        err.response?.data?.error ||
        'No se pudo crear el producto. Comprueba los datos o la imagen.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Añadir Nuevo Producto (Admin)</h2>

      {submitError && <p className={styles.errorText}>{submitError}</p>}

      <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data" noValidate>
        <FormInput
          label="Nombre del producto"
          id="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          autoFocus
        />

        <FormInput
          label="Precio (€)"
          id="price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          error={errors.price}
        />

        <FormInput
          label="Stock disponible"
          id="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          error={errors.stock}
        />

        <div className={styles.field}>
          <label>Imagen del producto (Subir archivo)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={`${styles.input} ${styles.fileInput}`}
          />
          {imageFile && <small className={styles.selectedFileText}>Archivo seleccionado: {imageFile.name}</small>}
        </div>

        <FormInput
          label="Descripción"
          id="description"
          type="textarea"
          rows="4"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? 'Subiendo a Cloudinary...' : 'Crear Producto'}
        </button>
      </form>

      <div className={styles.backLinkContainer}>
        <Link to="/products" className={styles.backLink}>&larr; Volver al catálogo</Link>
      </div>
    </div>
  );
}