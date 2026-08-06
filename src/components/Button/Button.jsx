import clsx from 'clsx';
import styles from './Button.module.css';

export default function Button({
    children,
    type = 'button',
    variant = 'primary',
    disabled = false,
    className = '',
    ...props
}) {
    return (
        <button
            type={type}
            disabled={disabled}
            aria-disabled={disabled}
            className={clsx(
                styles.btn,
                styles[variant],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}