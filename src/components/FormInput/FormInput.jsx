import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import styles from './FormInput.module.css';

export default function FormInput({
    label,
    id,
    type = 'text',
    error,
    autoFocus = false,
    className = '',
    name,
    ...props
}) {
    const inputRef = useRef(null);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const errorId = `${id}-error`;
    const isTextarea = type === 'textarea';

    return (
        <div className={clsx(styles.inputGroup, className)}>
            {label && (
                <label
                    htmlFor={id}
                    className={styles.label}
                >
                    {label}
                </label>
            )}

            {isTextarea ? (
                <textarea
                    id={id}
                    name={name || id}
                    ref={inputRef}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    className={clsx(
                        styles.input,
                        error && styles.inputError
                    )}
                    {...props}
                />
            ) : (
                <input
                    id={id}
                    name={name || id}
                    type={type}
                    ref={inputRef}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    className={clsx(
                        styles.input,
                        error && styles.inputError
                    )}
                    {...props}
                />
            )}

            {error && (
                <span
                    id={errorId}
                    className={styles.error}
                >
                    {error}
                </span>
            )}
        </div>
    );
}