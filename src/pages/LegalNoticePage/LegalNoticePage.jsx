import { Link } from 'react-router-dom';
import styles from './LegalNoticePage.module.css';

export default function LegalNoticePage() {
    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Aviso Legal</h1>

            <p className={styles.updated}>Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

            <section className={styles.section}>
                <h2>1. Identificación</h2>
                <p>
                    Titular: Marta Bosquet<br />
                    Contacto: tienda@bakioatxurre.eus<br />
                    Ubicación: Bakio (Bizkaia)
                </p>
            </section>

            <section className={styles.section}>
                <h2>2. Objeto</h2>
                <p>Esta web tiene como finalidad la venta de merchandising oficial del club. Es un proyecto desarrollado con fines educativos.</p>
            </section>

            <section className={styles.section}>
                <h2>3. Condiciones de uso</h2>
                <p>El acceso y uso de esta web atribuye la condición de usuario y supone la aceptación de las condiciones aquí descritas.</p>
            </section>

            <section className={styles.section}>
                <h2>4. Propiedad intelectual</h2>
                <p>Los contenidos de esta web (textos, imágenes, diseño) son propiedad de sus respectivos titulares y no pueden reproducirse sin autorización.</p>
            </section>

            <p className={styles.back}>
                <Link to="/">← Volver al inicio</Link>
            </p>
        </main>
    );
}