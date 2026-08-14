import { Link } from 'react-router-dom';
import styles from '../LegalNoticePage/LegalNoticePage.module.css';

export default function CookiesPage() {
    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Política de Cookies</h1>

            <p className={styles.updated}>Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

            <section className={styles.section}>
                <h2>1. Qué son las cookies</h2>
                <p>Las cookies son pequeños archivos que se almacenan en tu navegador para recordar información entre visitas.</p>
            </section>

            <section className={styles.section}>
                <h2>2. Cookies que usamos</h2>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Cookie</th>
                            <th>Tipo</th>
                            <th>Finalidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>token</td>
                            <td>Técnica (httpOnly)</td>
                            <td>Mantener tu sesión iniciada de forma segura</td>
                        </tr>
                        <tr>
                            <td>__stripe_*</td>
                            <td>Terceros (Stripe)</td>
                            <td>Procesar el pago y prevenir fraude</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section className={styles.section}>
                <h2>3. Cómo desactivarlas</h2>
                <p>Puedes eliminar o bloquear las cookies desde la configuración de tu navegador. Ten en cuenta que desactivar la cookie de sesión te impedirá mantener la sesión iniciada.</p>
            </section>

            <p className={styles.back}>
                <Link to="/">← Volver al inicio</Link>
            </p>
        </main>
    );
}