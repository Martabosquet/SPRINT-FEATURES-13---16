import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsersAdmin, updateUserRoleAdmin, deleteUserByAdmin } from '../../api/auth';
import { authStorage } from '../../utils/authStorage';
import styles from './AdminUsersPage.module.css';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [busyId, setBusyId] = useState(null);

    // El propio admin no debería poder tocarse a sí mismo desde aquí,
    // igual que ya lo bloquea el backend — lo reflejamos también en la UI.
    const currentUserId = Number(authStorage.userId);

    useEffect(() => {
        async function loadUsers() {
            try {
                const response = await getAllUsersAdmin();
                setUsers(response.data);
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar los usuarios.');
            } finally {
                setLoading(false);
            }
        }
        loadUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        setBusyId(userId);
        try {
            const response = await updateUserRoleAdmin(userId, newRole);
            setUsers((current) =>
                current.map((user) => (user.id === userId ? response.data : user))
            );
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'No se pudo actualizar el rol.');
        } finally {
            setBusyId(null);
        }
    };

    const handleDelete = async (userId, userName) => {
        if (!window.confirm(`¿Seguro que quieres eliminar la cuenta de "${userName}"? Esta acción es irreversible.`)) {
            return;
        }

        setBusyId(userId);
        try {
            await deleteUserByAdmin(userId);
            setUsers((current) => current.filter((user) => user.id !== userId));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'No se pudo eliminar el usuario.');
        } finally {
            setBusyId(null);
        }
    };

    if (loading) {
        return <p className={styles.message}>Cargando usuarios...</p>;
    }

    if (error) {
        return <p className={styles.error}>{error}</p>;
    }

    return (
        <div className={styles.container}>
            <h2>Gestión de usuarios</h2>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Email</th>
                        <th>Registrado</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => {
                        const isSelf = user.id === currentUserId;
                        const isBusy = busyId === user.id;

                        return (
                            <tr key={user.id}>
                                <td>
                                    <div className={styles.userCell}>
                                        {user.profileImage ? (
                                            <img src={user.profileImage} alt={user.name} className={styles.avatar} />
                                        ) : (
                                            <div className={styles.avatarPlaceholder}>
                                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                        )}
                                        <span>{user.name}{isSelf && ' (tú)'}</span>
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>{new Date(user.createdAt).toLocaleDateString('es-ES')}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        disabled={isSelf || isBusy}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className={styles.roleSelect}
                                    >
                                        <option value="user">Usuario</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(user.id, user.name)}
                                        disabled={isSelf || isBusy}
                                        className={styles.deleteButton}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div style={{ marginTop: '1.5rem' }}>
                <Link to="/products" className={styles.backLink}>&larr; Volver al catálogo</Link>
            </div>
        </div>
    );
}