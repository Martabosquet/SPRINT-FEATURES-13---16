import { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        try {
            const response = await api.post('/api/auth/register', { name, email, password });

            if (response.data.ok) {
                alert('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
                navigate('/login');
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            alert(error.response?.data?.error || 'Error al registrar el usuario');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Crear Cuenta</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="name" className={styles.label}>Nombre Completo:</label>
                    <input
                        type="text"
                        id="name"
                        ref={nameRef}
                        required
                        className={styles.input}
                    />
                </div>
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
                    Registrarse
                </button>
            </form>
            <p className={styles.textFooter}>
                ¿Ya tienes cuenta? <Link to="/login" className={styles.link}>Inicia sesión</Link>
            </p>
        </div>
    );
}