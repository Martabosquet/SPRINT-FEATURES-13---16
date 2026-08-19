import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrdersAdmin, updateOrderStatusAdmin } from '../../api/orders';
import styles from './AdminOrdersPage.module.css';

const STATUS_LABELS = {
    PAID: 'Pagado',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
};

const STATUS_OPTIONS = ['PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        async function loadOrders() {
            try {
                const response = await getAllOrdersAdmin();
                setOrders(response.data);
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar los pedidos.');
            } finally {
                setLoading(false);
            }
        }
        loadOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const response = await updateOrderStatusAdmin(orderId, newStatus);
            setOrders((current) =>
                current.map((order) => (order.id === orderId ? response.data : order))
            );
        } catch (err) {
            console.error(err);
            alert('No se pudo actualizar el estado del pedido.');
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return <p className={styles.message}>Cargando pedidos...</p>;
    }

    if (error) {
        return <p className={styles.error}>{error}</p>;
    }

    return (
        <div className={styles.container}>
            <h2>Gestión de pedidos</h2>

            {orders.length === 0 ? (
                <p className={styles.message}>Todavía no hay pedidos.</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Pedido</th>
                            <th>Fecha</th>
                            <th>Productos</th>
                            <th>Total</th>
                            <th>Envío</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className={styles.mono}>#{order.id.slice(0, 8)}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString('es-ES')}</td>
                                <td>
                                    <ul className={styles.itemList}>
                                        {order.items.map((item) => (
                                            <li key={item.id}>
                                                {item.product?.name ?? 'Producto'} × {item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>{Number(order.total).toFixed(2)} €</td>
                                <td>
                                    {order.street}, {order.city} ({order.postalCode})
                                </td>
                                <td>
                                    <select
                                        value={order.status}
                                        disabled={updatingId === order.id}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className={styles.statusSelect}
                                    >
                                        {STATUS_OPTIONS.map((statusOption) => (
                                            <option key={statusOption} value={statusOption}>
                                                {STATUS_LABELS[statusOption]}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div style={{ marginTop: '1.5rem' }}>
                <Link to="/products" className={styles.backLink}>&larr; Volver al catálogo</Link>
            </div>
        </div>
    );
}