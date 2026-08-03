import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom'; // 1. Importamos useSearchParams
import { useDispatch } from 'react-redux'; 
import api from '../../api/axios';
import { getCart } from '../../api/cart'; 
import { setLocalCart } from '../../store/cartSlice'; 
import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/Button/Button';
import styles from './LoginPage.module.css';

// Función auxiliar para validar el formato de un email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginPage() {
    // Estado controlado: cada campo del formulario tiene su propio estado
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Estado para los errores de validación de cada campo
    const [errors, setErrors] = useState({});

    // Estado para el error general de la petición (ej: credenciales incorrectas)
    const [submitError, setSubmitError] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // 2. Leemos los parámetros de la URL para saber si la sesión ha expirado
    const [searchParams] = useSearchParams();
    const isSessionExpired = searchParams.get('expired') === 'true';

    // Validación previa al envío del formulario
    const validate = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = 'El email es obligatorio.';
        } else if (!isValidEmail(email)) {
            newErrors.email = 'Introduce un email con formato válido.';
        }
        if (!password) {
            newErrors.password = 'La contraseña es obligatoria.';
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

        // Si no hay errores, limpiamos y enviamos
        setErrors({});
        try {
            const response = await api.post('/api/auth/login', { email, password });
            if (response.data.ok) {
                // El token ya está en la cookie httpOnly
                localStorage.setItem('userName', response.data.user?.name || 'Usuario');

                // Recuperamos el carrito del usuario desde el backend
                try {
                    const userCart = await getCart();
                    if (Array.isArray(userCart)) {
                        dispatch(setLocalCart(userCart));
                    }
                } catch (cartError) {
                    console.error('Error al recuperar el carrito del usuario', cartError);
                }

                // Avisamos a toda la app de que el estado de sesión ha cambiado
                window.dispatchEvent(new Event('authChange'));

                navigate('/products');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setSubmitError(error.response?.data?.error || 'Email o contraseña incorrectos.');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Iniciar Sesión</h2>

            {/* 3. Aviso visual si el usuario llegó aquí por expiración del token */}
            {isSessionExpired && (
                <div className={styles.expiredAlert}>
                    Tu sesión ha caducado por inactividad. Por favor, vuelve a iniciar sesión.
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
                {/* autoFocus en el primer campo gracias al componente FormInput */}
                <FormInput
                    label="Email:"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    autoFocus
                />
                <FormInput
                    label="Contraseña:"
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                />

                {/* Error general de la petición (respuesta del servidor) */}
                {submitError && <p className={styles.submitError}>{submitError}</p>}

                <Button type="submit" variant="primary">
                    Entrar
                </Button>
            </form>
            <p className={styles.textFooter}>
                ¿No tienes cuenta? <Link to="/register" className={styles.link}>Regístrate aquí</Link>
            </p>
        </div>
    );
}