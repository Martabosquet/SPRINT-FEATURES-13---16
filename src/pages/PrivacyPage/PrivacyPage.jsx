import { Link } from 'react-router-dom';
import styles from '../LegalNoticePage/LegalNoticePage.module.css';

export default function PrivacyPage() {
    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Política de Privacidad</h1>

            <p className={styles.updated}>Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

            <section className={styles.section}>
                <h2>1. Responsable del tratamiento</h2>
                <p>Marta Bosquet, con contacto en tienda@bakioatxurre.eus, es responsable del tratamiento de los datos personales que nos facilitas a través de esta web.</p>
            </section>

            <section className={styles.section}>
                <h2>2. Qué datos recogemos</h2>
                <p>Recogemos los datos que nos proporcionas al registrarte, comprar o contactarnos: nombre, email, dirección de envío y, en su caso, foto de perfil. Los datos de pago los gestiona directamente Stripe; nosotros no almacenamos números de tarjeta.</p>
            </section>

            <section className={styles.section}>
                <h2>3. Para qué usamos tus datos</h2>
                <ul>
                    <li>Gestionar tu cuenta y tus pedidos</li>
                    <li>Procesar pagos a través de Stripe</li>
                    <li>Responder a tus consultas</li>
                    <li>Mejorar el funcionamiento de la web</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2>4. Con quién compartimos tus datos</h2>
                <p>Compartimos los datos estrictamente necesarios con proveedores que nos ayudan a operar la web: Stripe (pagos) y Cloudinary (almacenamiento de imágenes). No vendemos tus datos a terceros.</p>
            </section>

            <section className={styles.section}>
                <h2>5. Tus derechos</h2>
                <p>Puedes solicitar acceso, rectificación o eliminación de tus datos escribiendo a tienda@bakioatxurre.eus. También puedes eliminar tu cuenta directamente desde tu perfil.</p>
            </section>

            <p className={styles.back}>
                <Link to="/">← Volver al inicio</Link>
            </p>
        </main>
    );
}