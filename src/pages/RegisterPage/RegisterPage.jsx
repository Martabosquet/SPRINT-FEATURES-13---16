import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/Button/Button';
import styles from './RegisterPage.module.css';

// Función auxiliar para validar el formato de un email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function RegisterPage() {
    // Estado controlado: cada campo tiene su propio estado
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [imageFile, setImageFile] = useState(null); // 🟢 Estado para almacenar el archivo de la foto

    // Estado para los errores de validación de cada campo
    const [errors, setErrors] = useState({});

    // Estado para el error general de la petición (ej: email ya en uso)
    const [submitError, setSubmitError] = useState('');

    const navigate = useNavigate();

    // Validación completa del formulario antes de enviar
    const validate = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = 'El nombre es obligatorio.';
        }
        if (!email) {
            newErrors.email = 'El email es obligatorio.';
        } else if (!isValidEmail(email)) {
            newErrors.email = 'Introduce un email con formato válido.';
        }
        if (!password) {
            newErrors.password = 'La contraseña es obligatoria.';
        } else if (password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Debes confirmar tu contraseña.';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden.';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        // Ejecutamos la validación antes de enviar la petición
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Si no hay errores, montamos el FormData para enviar archivos y texto al backend
        setErrors({});
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            if (imageFile) {
                formData.append('profileImage', imageFile); // 🟢 Añadimos la foto si el usuario la seleccionó
            }

            const response = await api.post('/api/auth/register', formData);
            
            if (response.data.ok) {
                navigate('/login');
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            setSubmitError(error.response?.data?.error || 'Error al registrar el usuario.');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Crear Cuenta</h2>
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
                {/* autoFocus en el primer campo gracias al componente FormInput */}
                <FormInput
                    label="Nombre Completo:"
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={errors.name}
                    autoFocus
                />
                <FormInput
                    label="Email:"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                />
                <FormInput
                    label="Contraseña:"
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                />
                <FormInput
                    label="Confirmar Contraseña:"
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={errors.confirmPassword}
                />

                {/* 🟢 Campo para adjuntar la foto de perfil en el registro */}
                <div className={styles.field} style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="profileImage" style={{ fontSize: '14px', fontWeight: '500' }}>Foto de perfil (opcional):</label>
                    <input 
                        id="profileImage"
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setImageFile(e.target.files[0])} 
                    />
                </div>

                {/* Error general de la petición (respuesta del servidor) */}
                {submitError && <p className={styles.submitError}>{submitError}</p>}

                <Button type="submit" variant="primary">
                    Registrarse
                </Button>
            </form>
            <p className={styles.textFooter}>
                ¿Ya tienes cuenta? <Link to="/login" className={styles.link}>Inicia sesión</Link>
            </p>
        </div>
    );
}