import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import HomePage from '../pages/HomePage/HomePage';
import ProductsPage from '../pages/ProductsPage/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage/ProductDetailPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';

// Define la configuración de rutas mediante un array de objetos y permite habilitar funcionalidades avanzadas como loaders, actions y optimizaciones de carga de datos.
export const router = createBrowserRouter([
  {
    // Ruta raíz que actúa como envoltorio común (Layout).
    path: '/',
    element: <Layout />,

    // Los elementos definidos aquí se renderizarán dentro del componente <Outlet /> de Layout.
    children: [
      {
        index: true, // index: true indica que este componente es la ruta por defecto.
        element: <HomePage />
      },
      {
        path: 'products',
        element: <ProductsPage />   // Ruta hija para ver el catálogo de productos: '/products'
      },
      {
        path: 'products/:id',  // El valor de ':id' puede ser accedido en ProductDetailPage usando el hook useParams()
        element: <ProductDetailPage />
      },
      {
        path: '*',  // Ruta comodín (wildcard): captura cualquier URL que no coincida con las anteriores para renderizar una página de error 404
        element: <NotFoundPage />
      }
    ]
  }
]);