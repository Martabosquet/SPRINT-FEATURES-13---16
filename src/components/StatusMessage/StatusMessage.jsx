import styles from './StatusMessage.module.css';

function StatusMessage({ title, description, variant = 'neutral' }) {
  return (
    <section className={`${styles.box} ${styles[variant]}`}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </section>
  );
}

export default StatusMessage;