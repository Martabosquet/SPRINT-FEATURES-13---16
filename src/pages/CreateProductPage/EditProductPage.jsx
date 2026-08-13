import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useProduct } from '../../hooks/useProduct';
import { updateProduct } from '../../api/products';
import { validateProductForm } from '../../utils/validateProductForm';
import FormInput from '../../components/FormInput/FormInput';
import styles from '../CreateProductPage/CreateProductPage.module.css';

export default function EditProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: product, loading: productLoading, error: productError } = useProduct(id);

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

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name ?? '',
                price: product.price ?? '',
                description: product.description ?? '',
                stock: product.stock ?? '',
            });
        }
    }, [product]);

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

            await updateProduct(id, formData);

            navigate(`/products/${id}`);
        } catch (err) {
            console.error(err);
            setSubmitError(
                err.response?.data?.error ||
                'No se pudo actualizar el producto. Comprueba los datos o la imagen.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (productLoading) {
        return <p className={styles.container}>Cargando producto...</p>;
    }

    if (productError || !product) {
        return (
            <div className={styles.container}>
                <h2>Producto no encontrado</h2>
                <Link to="/products" className={styles.backLink}>&larr; Volver al catálogo</Link>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2>Editar Producto (Admin)</h2>

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
                    <label>Imagen actual</label>
                    {product.imageUrl && (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{ width: '120px', borderRadius: '0.5rem', marginBottom: '0.5rem' }}
                        />
                    )}
                    <label>Cambiar imagen (opcional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className={styles.input}
                        style={{ padding: '0.5rem' }}
                    />
                    {imageFile && <small style={{ color: '#666' }}>Archivo seleccionado: {imageFile.name}</small>}
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
                    {loading ? 'Guardando cambios...' : 'Guardar cambios'}
                </button>
            </form>

            <div style={{ marginTop: '1.5rem' }}>
                <Link to={`/products/${id}`} className={styles.backLink}>&larr; Cancelar y volver</Link>
            </div>
        </div>
    );
}