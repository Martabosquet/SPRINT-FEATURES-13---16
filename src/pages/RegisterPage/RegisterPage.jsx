import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../api/auth';
import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/Button/Button';
import styles from './RegisterPage.module.css';

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // const [imageFile, setImageFile] = useState(null);

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    const navigate = useNavigate();

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

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            // if (imageFile) {
            //     formData.append('profileImage', imageFile);
            // }

            const data = await register(formData);

            if (data.ok) {
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
{/* 
                <div className={styles.field} style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="profileImage" style={{ fontSize: '14px', fontWeight: '500' }}>Foto de perfil (opcional):</label>
                    <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                    />
                </div> */}

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