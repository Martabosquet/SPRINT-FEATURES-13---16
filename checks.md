# 📋 Checklist de Verificación de Funcionalidades — Atxurre CineClub

Este documento contiene la verificación de todas las funcionalidades, componentes y flujos de negocio del proyecto Full Stack **Atxurre CineClub**.

---

## 🚀 1. Entorno de Desarrollo y Despliegue en Producción

- [x] **Servidor Backend (Node.js + Express)**
  - *Estado:* Funciona correctamente.
  - *Detalle:* El backend se ejecuta en `http://localhost:3000`. Conecta con PostgreSQL (Prisma) y MongoDB Atlas (Mongoose).
- [x] **Cliente Frontend (React + Vite)**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Vite compila e inicia instantáneamente en `http://localhost:5173`.
- [x] **Despliegue en Producción con HTTPS**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Frontend desplegado en Netlify (`https://projectbreak3.netlify.app`) y Backend en Render (`https://project-break-2-t70h.onrender.com`).
- [x] **Configuración CORS y Cookies Seguras**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Lista blanca de orígenes permitidos activa con `credentials: true` y cookies `SameSite: "none"` con `Secure: true`.

---

## 🔐 2. Autenticación y Gestión de Sesión (Cookies HttpOnly)

- [x] **Registro de Usuarios (`POST /api/auth/register`)**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Hashea la contraseña con bcrypt y valida duplicidad de emails respondiendo 409 Conflict si ya existe.
- [x] **Inicio de Sesión con Cookie `httpOnly` (`POST /api/auth/login`)**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Emite el JWT en una cookie `httpOnly` segura impidiendo lecturas XSS desde el cliente.
- [x] **Cierre de Sesión (`POST /api/auth/logout`)**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Invoca `res.clearCookie("token", cookieOptions)` eliminando la cookie de sesión entre dominios de forma limpia.
- [x] **Expiración Transparente de Sesión (Interceptor Axios 401)**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Si la cookie expira o no es válida, la API devuelve 401 y el cliente redirige a `/login?expired=true` limpiando la sesión local.
- [x] **Edición de Perfil de Usuario**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Permite modificar nombre, email, contraseña y subir nueva foto de perfil a Cloudinary.
- [x] **Ficha de Perfil Cinéfilo**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Permite guardar y editar género favorito, director, película preferida y biografía personal.
- [x] **Vista de Perfil Público (`/profile/:userId`)**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Permite acceder a la ficha de cualquier socio de la comunidad desde sus valoraciones.

---

## 🍿 3. Catálogo de Productos y Búsqueda

- [x] **Listado de Productos (`GET /api/products`)**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Obtiene el catálogo completo cargado desde PostgreSQL mediante Prisma ORM.
- [x] **Buscador Reactivo en Tiempo Real**
  - *Estado:* Funciona correctamente.
  - *Detalle:* El input de búsqueda filtra al instante los productos por nombre sin peticiones innecesarias.
- [x] **Filtro de Ordenación**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Ordena dinámicamente por precio (menor a mayor / mayor a menor) y por orden alfabético (A-Z / Z-A).
- [x] **Detalle de Producto (`/products/:id`)**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Muestra la información completa del título, imagen en alta resolución, sinopsis, precio, disponibilidad de stock y resumen de valoraciones.

---

## 🛠️ 4. Panel de Administración y CRUD de Productos

- [x] **Rutas Protegidas por Rol Admin (`AdminRoute` + `requireRole('admin')`)**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Usuarios con rol `user` son redirigidos si intentan acceder a `/admin/*`. Solo usuarios con rol `admin` tienen acceso.
- [x] **Creación de Producto (`POST /api/products`)**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Formulario con subida de archivo de imagen a Cloudinary mediante Multer, guardando la URL generada en la BD.
- [x] **Edición de Producto (`PUT /api/products/:id`)**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Carga los datos existentes en el formulario y permite modificar campos o actualizar la imagen de forma opcional.
- [x] **Eliminación de Producto (`DELETE /api/products/:id`)**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Borra el producto de la base de datos tras confirmación del administrador.
- [x] **Validaciones Frontend y Backend (`validateProduct`)**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Impide el envío de formularios con campos numéricos negativos, precios nulos o cadenas vacías.

---

## 🛒 5. Carrito de Compra (Cart)

- [x] **Añadir al Carrito con Persistencia Backend**
  - *Estado:* Funciona correctamente.
  - *Detalle:* El carrito se guarda en PostgreSQL y se sincroniza en el cliente con Redux Toolkit.
- [x] **Control Estricto de Stock Dinámico**
  - *Estado:* Funciona correctamente.
  - *Detalle:* El servidor y el cliente impiden añadir más unidades de las disponibles en el stock del producto.
- [x] **Modificación de Cantidades y Borrado de Items**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Permite incrementar, decrementar o eliminar productos del carrito actualizando subtotales al instante.

---

## ❤️ 6. Lista de Deseos (Wishlist)

- [x] **Guardar y Eliminar Favoritos (`/api/wishlist`)**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Almacena las listas de deseos en MongoDB mediante Mongoose.
- [x] **Sincronización de Botones de Wishlist**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Los botones de corazón en la interfaz reaccionan inmediatamente al estado global de Redux.

---

## ⭐ 7. Sistema de Reseñas y Valoraciones (Reviews)

- [x] **Publicar Reseñas y Valoración (`POST /api/reviews`)**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Permite seleccionar puntuación de 1 a 10 estrellas y escribir un comentario sobre la película.
- [x] **Desglose de Puntuación Promedio (`RatingSummary`)**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Calcula el promedio total de estrellas y el porcentaje de distribuciones por nota.
- [x] **Protección de Permisos en Reseñas**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Únicamente el autor original de la reseña o un usuario `admin` pueden editar o eliminar el comentario.

---

## 💳 8. Checkout Seguro e Integración con Stripe

- [x] **Cálculo Servidor de PaymentIntents (`POST /api/checkout`)**
  - *Estado:* Funciona correctamente.
  - *Detalle:* El backend calcula el total leyendo los precios y cantidades reales en BD (evitando manipulación client-side).
- [x] **Formulario Stripe Elements Integrado**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Embebe la pasarela de pago segura de Stripe Elements en el frontend.
- [x] **Procesamiento de Pedidos mediante Webhooks (`POST /api/webhooks/stripe`)**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Escucha el evento `payment_intent.succeeded` con parseo `express.raw` y validación de firma criptográfica.
- [x] **Idempotencia y Descuento de Stock**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Verifica el `stripePaymentIntentId` antes de procesar el pedido para evitar duplicados en reintentos de red.
- [x] **Confirmación de Pago con Polling (`CheckoutSuccessPage`)**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Reintenta la consulta periódicamente mientras el webhook completa la creación del pedido en segundo plano.

---

## 🎨 9. Estilos y Arquitectura CSS Modules

- [x] **Migración Completa de Estilos Inline**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Todos los componentes `.jsx` utilizan clases importadas de sus respectivos módulos `.module.css`.
- [x] **Uso de Variables CSS Custom Properties**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Se utilizan variables CSS como `--bar-width` para estilos calculados en tiempo de ejecución, manteniendo las reglas de diseño 100% aisladas en CSS.

---

## 📄 10. Documentación API y Pruebas Automatizadas

- [x] **Especificación OpenAPI / Swagger UI (`GET /api/docs`)**
  - *Estado:* Funciona correctamente.
  - *Detalle:* Interfaz interactiva completa cargada y accesible en `/api/docs`.
- [x] **Suite de Pruebas Automatizadas Jest + Supertest**
  - *Estado:* Funciona correctamente.
  - *Detalle:* **11/11 Test Suites PASSED** y **88/88 Tests PASSED**.

---

*Comprobación técnica y funcional completada el 14 de agosto de 2026.*
