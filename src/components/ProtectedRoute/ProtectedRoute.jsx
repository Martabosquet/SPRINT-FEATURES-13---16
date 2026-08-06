import { Navigate, Outlet } from 'react-router-dom';
import { authStorage } from '../../utils/authStorage';
// Si usas un hook personalizado como 'useAuth', puedes importarlo aquí

export default function ProtectedRoute() {
    // Verificamos si existe el token en el almacenamiento
    const token = authStorage.token;

    // Si no hay token, redirigimos al login de inmediato
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si hay token, 'Outlet' renderiza la página que el usuario quería ver
    return <Outlet />;
}