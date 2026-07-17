import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import HomePage from '../pages/HomePage/HomePage';
import ProductsPage from '../pages/ProductsPage/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage/ProductDetailPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';

// createBrowserRouter es el enrutador moderno basado en datos de React Router.
// Define la configuración de rutas mediante un array de objetos y permite habilitar
// funcionalidades avanzadas como loaders, actions y optimizaciones de carga de datos.
export const router = createBrowserRouter([
  {
    // Ruta raíz que actúa como envoltorio común (Layout).
    path: '/',
    element: <Layout />,
    // Rutas anidadas (hijas) de la raíz.
    // Los elementos definidos aquí se renderizarán dentro del componente <Outlet /> de Layout.
    children: [
      {
        // index: true indica que este componente es la ruta por defecto.
        // Se renderiza cuando la URL coincide exactamente con el path del padre ('/').
        index: true,
        element: <HomePage />
      },
      {
        // Ruta hija para ver el catálogo de productos: '/products'
        path: 'products',
        element: <ProductsPage />
      },
      {
        // Ruta dinámica con un parámetro de URL: '/products/:id'
        // El valor de ':id' puede ser accedido en ProductDetailPage usando el hook useParams().
        path: 'products/:id',
        element: <ProductDetailPage />
      },
      {
        // Ruta comodín (wildcard): captura cualquier URL que no coincida con las anteriores para renderizar una página de error 404.
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);