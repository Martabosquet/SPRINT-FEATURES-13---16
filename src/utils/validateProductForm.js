// utils/validateProductForm.js

export function validateProductForm(form) {
    const errors = {};

    if (!form.name || form.name.trim() === '') {
        errors.name = 'El nombre es obligatorio.';
    }

    if (form.price === '' || form.price === null || form.price === undefined) {
        errors.price = 'El precio es obligatorio.';
    } else {
        const parsedPrice = parseFloat(form.price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            errors.price = 'El precio debe ser un número positivo.';
        }
    }

    // El stock es opcional, igual que en el backend, pero si se rellena
    // debe ser un entero no negativo.
    if (form.stock !== '' && form.stock !== null && form.stock !== undefined) {
        const parsedStock = Number(form.stock);
        if (isNaN(parsedStock) || parsedStock < 0 || !Number.isInteger(parsedStock)) {
            errors.stock = 'El stock debe ser un número entero no negativo.';
        }
    }

    return errors;
}