import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useProduct } from '../../hooks/useProduct';
import { updateProduct } from '../../api/products';
import FormInput from '../../components/FormInput/FormInput';
import styles from './CreateProductPage.module.css';

export default function EditProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: product, loading: productLoading, error: productError } = useProduct(id);

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

        if (!form.price && form.price !== 0) {
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

            await updateProduct(id, formData);
            navigate(`/products/${id}`);
        } catch (err) {
            console.error(err);
            setError('No se pudo actualizar el producto. Comprueba los datos o la imagen.');
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
                />

                <FormInput
                    label="Stock disponible"
                    id="stock"
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleChange}
                    error={formErrors.stock}
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

                <div className={styles.field}>
                    <label htmlFor="description">Descripción</label>
                    <textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows="4"
                        className={styles.textarea}
                    />
                </div>

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