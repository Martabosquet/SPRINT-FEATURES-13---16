import { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import styles from './LoginPage.module.css'; // Importación vinculada

export default function LoginPage() {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        try {
            const response = await api.post('/api/auth/login', { email, password });
            if (response.data.ok) {
                localStorage.setItem('token', response.data.token);
                // Guardamos el nombre para poder mostrarlo luego en el Navbar
                localStorage.setItem('userName', response.data.user?.name || 'Usuario');

                // Avisamos a toda la app de que el estado de sesión ha cambiado
                window.dispatchEvent(new Event('authChange'));

                alert('¡Inicio de sesión correcto!');
                navigate('/products');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert(error.response?.data?.error || 'Error al iniciar sesión');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.label}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        ref={emailRef}
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.label}>Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        ref={passwordRef}
                        required
                        className={styles.input}
                    />
                </div>
                <button type="submit" className={styles.button}>
                    Entrar
                </button>
            </form>
            <p className={styles.textFooter}>
                ¿No tienes cuenta? <Link to="/register" className={styles.link}>Regístrate aquí</Link>
            </p>
        </div>
    );
}