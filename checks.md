# Verificación de Funcionalidades del Proyecto

Este documento registra los resultados de las comprobaciones funcionales del proyecto de React + Vite con React Router.

## Checklist de Verificación

* [x] **`npm run dev` funciona**
  * *Estado:* Funciona correctamente.
  * *Detalle:* El servidor de desarrollo de Vite se levanta sin errores en `http://localhost:5173` y la página de inicio carga de manera instantánea.

* [x] **Navegación entre páginas funciona**
  * *Estado:* Funciona correctamente.
  * *Detalle:* Los enlaces del `Header` (`Inicio`, `Catálogo`) redirigen a las rutas correspondientes sin recargar completamente el navegador, manteniendo el estado de React.

* [x] **`/products` muestra productos**
  * *Estado:* Funciona correctamente.
  * *Detalle:* El catálogo muestra la cuadrícula completa de productos cargados desde los datos de prueba (`mockProducts.js`) de forma visual e interactiva.

* [x] **`/products/:id` muestra detalle**
  * *Estado:* Funciona correctamente.
  * *Detalle:* Al hacer clic en "Ver detalle" en cualquiera de las tarjetas de producto, se navega correctamente a la ruta dinámica (por ejemplo, `/products/1`) y se despliega la descripción, stock, precio e imagen correspondiente al producto seleccionado.

* [x] **Buscador funciona**
  * *Estado:* Funciona correctamente.
  * *Detalle:* El campo de texto filtra de forma reactiva y en tiempo real los productos que coinciden con la consulta. Al vaciar el buscador, se restablece el catálogo completo.

* [x] **404 funciona**
  * *Estado:* Funciona correctamente.
  * *Detalle:* Cualquier ruta no definida en la configuración del router (por ejemplo, `/ruta-inventada`) captura la excepción con el comodín `*` y muestra la página `NotFoundPage` con el título *"404 - Página no encontrada"*.

---

*Última verificación automatizada y manual realizada con éxito el 17 de julio de 2026.*
