import { RouterProvider } from 'react-router-dom';
import { router } from './router/index';

// RouterProvider es el componente que inicializa y conecta la configuración del router
// (creada mediante createBrowserRouter) con la aplicación de React. Provee el contexto necesario
// para que componentes como <Link>, <NavLink>, <Outlet> y los hooks (useParams, useNavigate, etc.) funcionen.
export default function App() {
  return <RouterProvider router={router} />;
}