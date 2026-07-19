import { useEffect, useRef } from 'react';
import styles from './FormInput.module.css';

export default function FormInput({
    label,
    id,
    type = 'text',
    error,
    autoFocus,
    className = '',
    ...props
}) {
    const inputRef = useRef(null);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    return (
        <div className={`${styles.inputGroup} ${className}`}>
            {label && (
                <label htmlFor={id} className={styles.label}>
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                ref={inputRef}
                className={`${styles.input} ${error ? styles.inputError : ''}`}
                {...props}
            />
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
}
