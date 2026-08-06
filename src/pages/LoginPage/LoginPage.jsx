import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { login, getProfile } from '../../api/auth';
import { getCart } from '../../api/cart';

import { setLocalCart } from '../../store/cartSlice';
import { saveSession, notifyAuthChange } from '../../utils/authStorage';

import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/Button/Button';

import styles from './LoginPage.module.css';


function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


export default function LoginPage() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [searchParams] = useSearchParams();

    const isSessionExpired =
        searchParams.get('expired') === 'true';


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    const [loading, setLoading] = useState(false);



    const validate = () => {

        const newErrors = {};

        if (!email) {
            newErrors.email =
                'El email es obligatorio.';
        } else if (!isValidEmail(email)) {
            newErrors.email =
                'Introduce un email válido.';
        }


        if (!password) {
            newErrors.password =
                'La contraseña es obligatoria.';
        }


        return newErrors;
    };



    const loadProfileImage = async () => {

        try {

            const profileData =
                await getProfile();

            // Intentamos acceder a la foto desde diferentes rutas posibles
            const profileImage = 
                profileData?.profileImage ||
                profileData?.data?.profileImage ||
                profileData?.user?.profileImage ||
                '';

            saveSession({
                userProfileImage: profileImage
            });

        } catch (error) {

            console.error(
                'Error recuperando perfil:',
                error
            );

            saveSession({
                userProfileImage: ''
            });
        }
    };



    const loadCart = async () => {

        try {

            const userCart =
                await getCart();


            if (Array.isArray(userCart)) {

                dispatch(
                    setLocalCart(userCart)
                );

            }

        } catch (error) {

            console.error(
                'Error recuperando carrito:',
                error
            );
        }
    };



    const handleSubmit = async (event) => {

        event.preventDefault();

        setSubmitError('');


        const validationErrors =
            validate();


        if (Object.keys(validationErrors).length > 0) {

            setErrors(validationErrors);
            return;

        }


        setErrors({});
        setLoading(true);


        try {

            const data =
                await login({
                    email,
                    password
                });


            if (!data.ok) {

                setSubmitError(
                    'Email o contraseña incorrectos.'
                );

                return;
            }



            // Guardamos información básica de sesión
            saveSession({
                token: data.token || '',
                userName:
                    data.user?.name || 'Usuario',

                admin:
                    data.user?.role === 'admin'
                        ? 'true'
                        : 'false'

            });



            // Datos adicionales del usuario
            await loadProfileImage();


            // Sincronizamos carrito
            await loadCart();


            // Actualizamos componentes que dependen de sesión
            notifyAuthChange();



            navigate('/products');


        } catch (error) {

            console.error(
                'Error al iniciar sesión:',
                error
            );


            setSubmitError(
                error.response?.data?.error ||
                'Email o contraseña incorrectos.'
            );


        } finally {

            setLoading(false);

        }

    };



    return (

        <main className={styles.container}>

            <section className={styles.card}>


                <header className={styles.header}>

                    <h1 className={styles.title}>
                        🎬 Atxurre CineClub
                    </h1>


                    <p className={styles.subtitle}>
                        Inicia sesión para acceder
                        a tu colección.
                    </p>

                </header>



                {isSessionExpired && (

                    <div className={styles.expiredAlert}>
                        Tu sesión ha caducado.
                        Por favor, vuelve a iniciar sesión.
                    </div>

                )}



                <form
                    onSubmit={handleSubmit}
                    className={styles.form}
                    noValidate
                >


                    <FormInput

                        label="Email"

                        id="email"

                        type="email"

                        value={email}

                        onChange={(event) =>
                            setEmail(event.target.value)
                        }

                        error={errors.email}

                        autoFocus

                    />



                    <FormInput

                        label="Contraseña"

                        id="password"

                        type="password"

                        value={password}

                        onChange={(event) =>
                            setPassword(event.target.value)
                        }

                        error={errors.password}

                    />



                    {submitError && (

                        <p className={styles.submitError}>
                            {submitError}
                        </p>

                    )}



                    <Button

                        type="submit"

                        variant="primary"

                        disabled={loading}

                    >
                        {
                            loading
                                ? 'Entrando...'
                                : 'Entrar'
                        }

                    </Button>


                </form>



                <p className={styles.footer}>

                    ¿No tienes cuenta?

                    {' '}

                    <Link
                        to="/register"
                        className={styles.link}
                    >
                        Regístrate aquí
                    </Link>

                </p>


            </section>

        </main>

    );
}