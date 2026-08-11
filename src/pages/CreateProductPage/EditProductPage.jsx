import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useProduct } from '../../hooks/useProduct';
import { updateProduct } from '../../api/products';
import styles from '../CreateProductPage/CreateProductPage.module.css';

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

    const [imageFile, setImageFile] = useState(null);

    // En cuanto llegan los datos del producto, precargamos el formulario
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
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('price', Number(form.price));
            formData.append('stock', Number(form.stock));
            formData.append('description', form.description);

            // Solo mandamos imagen si el admin seleccionó una nueva;
            // si no, el backend debería conservar la imagen existente.
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
                    {loading ? 'Guardando cambios...' : 'Guardar cambios'}
                </button>
            </form>

            <div style={{ marginTop: '1.5rem' }}>
                <Link to={`/products/${id}`} className={styles.backLink}>&larr; Cancelar y volver</Link>
            </div>
        </div>
    );
}