# 🎬 Atxurre CineClub — E-commerce Full Stack de Películas

Proyecto de e-commerce Full Stack desarrollado como parte del **Módulo 3 (Full Stack Developer + IA)** en **The Bridge**.

El proyecto evoluciona la base construida en sprints anteriores (catálogo, auth, carrito, wishlist, checkout, Redux Toolkit, deploy) hacia un producto de nivel profesional que incluye **panel de administración con CRUD real, autenticación basada en Cookies HttpOnly entre dominios, control estricto de roles (`ADMIN` vs `USER`), subida de imágenes a Cloudinary, pasarela de pagos con Stripe Elements y Webhooks idempotentes, documentación OpenAPI/Swagger y refactorización modular CSS (CSS Modules)**.

---

## 📚 Índice

- [Checklist de Criterios de Evaluación Cumplidos](#-checklist-de-criterios-de-evaluación-cumplidos)
- [Matriz de Permisos por Rol (ADMIN vs USER)](#-matriz-de-permisos-por-rol-admin-vs-user)
- [Estructura del Repositorio](#-estructura-del-repositorio)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura de Datos y Patrón de Capas](#-arquitectura-de-datos-y-patrón-de-capas)
- [Funcionalidades y Experiencia de Usuario](#-funcionalidades-y-experiencia-de-usuario)
- [Decisiones de Seguridad y Mejores Prácticas](#-decisiones-de-seguridad-y-mejores-prácticas)
- [Pasarela de Pagos Stripe & Webhooks](#-pasarela-de-pagos-stripe--webhooks)
- [Estilos y Arquitectura CSS (CSS Modules)](#-estilos-y-arquitectura-css-css-modules)
- [Documentación API (Swagger / OpenAPI)](#-documentación-api-swagger--openapi)
- [Testing y Calidad de Código](#-testing-y-calidad-de-código)
- [Variables de Entorno](#-variables-de-entorno)
- [Guía de Ejecución en Local](#-guía-de-ejecución-en-local)
- [Despliegue en Producción](#-despliegue-en-producción)

---

## 📋 Checklist de Criterios de Evaluación Cumplidos

| Criterio de Evaluación | Estado | Implementación y Evidencia Técnica |
| :--- | :---: | :--- |
| **1. Backend Robusto y Adaptado** | ✅ Cumplido | Express con `authMiddleware` leyendo cookies `httpOnly`, control estricto de roles (`requireRole('admin')`), endpoints para Stripe (`/api/checkout`, `/api/webhooks/stripe`) y Multer/Cloudinary. Manejador de errores centralizado (`errorHandler.js`) que procesa errores de Prisma (`P2002`, `P2025`), JWT y validaciones con respuestas semánticas JSON y códigos HTTP adecuados (400, 401, 403, 404, 409, 500). |
| **2. Frontend Completo y Estructurado** | ✅ Cumplido | Estado global centralizado con Redux Toolkit (`authSlice`, `cartSlice`, `wishlistSlice`). Panel Admin con CRUD completo exclusivo para administradores (`CreateProductPage`, `EditProductPage`, `ProductsPage`). Rutas protegidas por rol con guardias `AdminRoute` y `ProtectedRoute`. Formularios reutilizables (`FormInput`, `Button`) con validación y mensajes claros. |
| **3. Integración Profesional Completa** | ✅ Cumplido | Cliente Axios configurado con `withCredentials: true` e interceptor de respuesta para auto-expiración de sesión ante respuestas `401`. Subida de imágenes a Cloudinary (productos y avatares de perfil). Flujo de pago real con Stripe Elements, sincronización de Redux y feedback UI excelente (`loading`, deshabilitado progresivo, alertas de error). Refactorización completa de estilos inline hacia CSS Modules. |
| **4. Repositorio Limpio y Documentación** | ✅ Cumplido | Organización en arquitectura monorepo desacoplada. Archivos `.gitignore` en backend y frontend protegiendo claves de API (`.env`), `node_modules` y builds. Documentación OpenAPI/Swagger interactiva disponible en `/api/docs`. |
| **5. Despliegue en Producción** | ✅ Cumplido | Frontend en Netlify (`https://projectbreak3.netlify.app`) y Backend en Render (`https://project-break-2-t70h.onrender.com`). Conexiones HTTPS, CORS configurado con lista blanca de orígenes y cookies seguras con `SameSite: "none"` y `Secure: true`. |

---

## 🛡️ Matriz de Permisos por Rol (`ADMIN` vs `USER`)

El sistema implementa una estricta separación de privilegios blindada en **dos capas independientes** (Frontend con guardias `AdminRoute` y Backend con middleware `requireRole('admin')`):

| Acción / Funcionalidad | Usuario Registrado (`USER`) | Administrador (`ADMIN`) | Mecanismo de Seguridad |
| :--- | :---: | :---: | :--- |
| **Explorar Catálogo y Detalle de Películas** | ✅ Permitido | ✅ Permitido | Acceso Público |
| **Añadir al Carrito, Wishlist y Comprar (Stripe)** | ✅ Permitido | ✅ Permitido | `ProtectedRoute` / `authMiddleware` |
| **Publicar Reseñas y Valoraciones** | ✅ Permitido | ✅ Permitido | `ProtectedRoute` / `authMiddleware` |
| **Editar / Eliminar Reseña Propia** | ✅ Permitido | ✅ Permitido | Verificación de autoría (`userId`) |
| **Editar / Eliminar Reseña Ajena** | ❌ **DENEGADO** | ✅ Permitido | Middleware de permisos en Backend |
| **Acceso al Panel Admin (`/admin/*`)** | ❌ **DENEGADO** | ✅ **Permitido** | `AdminRoute` (Redirige a `/products`) |
| **Crear Nuevo Producto** | ❌ **DENEGADO** | ✅ **PERMITIDO** | `requireRole('admin')` en `POST /api/products` |
| **Editar Producto Existente** | ❌ **DENEGADO** | ✅ **PERMITIDO** | `requireRole('admin')` en `PUT /api/products/:id` |
| **Eliminar Producto del Catálogo** | ❌ **DENEGADO** | ✅ **PERMITIDO** | `requireRole('admin')` en `DELETE /api/products/:id` |

> [!IMPORTANT]
> **Diferenciación Estricta de Poderes:** Un usuario estándar (`USER`) **no tiene poder bajo ningún concepto** para crear, modificar o eliminar productos del catálogo, ni para acceder a la sección de administración. Aunque un usuario malicioso intentase forzar las peticiones directamente a la API desde Postman o la consola del navegador, los endpoints de mutación (`POST`, `PUT`, `DELETE` en `/api/products`) rechazarán la solicitud devolviendo inmediatamente un código **HTTP 403 Forbidden** a menos que el JWT autenticado contenga el rol `ADMIN`.

---

## 📁 Estructura del Repositorio

El proyecto se divide de forma limpia en dos proyectos independientes:

```
V2 PROJECT BREAK/
├── project-break-2-backend/    # Servidor REST API (Node.js, Express, Prisma, Mongoose)
│   ├── src/
│   │   ├── config/             # Configuración de Prisma, Mongoose, Cloudinary, Multer
│   │   ├── controllers/        # Controladores HTTP por recurso (auth, products, cart, order, etc.)
│   │   ├── middlewares/        # Auth, requireRole, CORS, Helmet, RateLimit, Validaciones, ErrorHandler
│   │   ├── models/             # Esquemas de Mongoose (Review, Wishlist)
│   │   ├── routes/             # Enrutadores de Express estructurados por recurso
│   │   ├── services/           # Lógica de negocio reutilizable (Prisma/Mongoose queries)
│   │   └── tests/              # Pruebas automatizadas con Jest y Supertest (11 suites, 88 tests)
│   └── prisma/                 # Schema de Prisma y migraciones PostgreSQL
│
├── SPRINT-FEATURES-13---16/    # Aplicación Frontend (React + Vite + CSS Modules)
│   ├── src/
│   │   ├── api/                # Clientes Axios con withCredentials (auth, products, cart, etc.)
│   │   ├── components/         # Componentes UI reutilizables (CSS Modules aislados)
│   │   ├── hooks/              # Custom React Hooks (useProduct, etc.)
│   │   ├── pages/              # Vistas de la aplicación (ProductsPage, CreateProductPage, Checkout, etc.)
│   │   ├── router/             # React Router v6 + Guardias de navegación (AdminRoute, ProtectedRoute)
│   │   ├── store/              # Slices de Redux Toolkit (auth, cart, wishlist)
│   │   └── utils/              # Gestor de sesión authStorage y validadores de formulario
│
└── readme.md                   # Documentación principal del repositorio
```

---

## 🛠️ Stack Tecnológico

### Frontend
- **Librería & Build**: React + Vite
- **Enrutamiento**: React Router v6 (`createBrowserRouter`)
- **Gestión de Estado Global**: Redux Toolkit (`authSlice`, `cartSlice`, `wishlistSlice`)
- **Estilos**: Vanilla CSS con **CSS Modules** (`*.module.css`) + Variables CSS personalizadas
- **Peticiones HTTP**: Axios con `withCredentials: true` e interceptor de estado 401
- **Pasarela de Pagos**: Stripe Elements (`@stripe/stripe-js`, `@stripe/react-stripe-js`)

### Backend
- **Entorno Runtime**: Node.js (ES Modules nativos) + Express
- **BD Relacional / ORM**: PostgreSQL mediante **Prisma ORM** (Supabase)
- **BD Documental / ODM**: MongoDB mediante **Mongoose** (MongoDB Atlas)
- **Almacenamiento de Archivos**: Cloudinary API + Multer (`memoryStorage`)
- **Seguridad**: JWT en cookie `httpOnly`, Helmet (CSP), CORS dinámico, Rate Limiting
- **Pagos & Webhooks**: SDK Oficial de Stripe (PaymentIntents + Validación de firma de Webhooks)
- **Testing**: Jest + Supertest (`--experimental-vm-modules`)
- **Documentación API**: Swagger UI Express (`/api/docs`)

---

## 🏗️ Arquitectura de Datos y Patrón de Capas

### Estrategia de Base de Datos Dual
- **PostgreSQL (Prisma ORM)**: Entidades con alta integridad relacional y necesidad de transacciones atómicas:
  - `User`, `Product`, `Cart`, `CartItem`, `Order`, `OrderItem`.
  - Permite transacciones atómicas seguras en el checkout (descuento de stock + creación de orden + cierre del carrito activo en una sola operación).
- **MongoDB (Mongoose)**: Colecciones dinámicas y de alta frecuencia de escritura sin necesidad de transacciones cruzadas:
  - `Review` (comentarios y valoraciones vinculadas a usuarios y productos).
  - `Wishlist` (listas de favoritos).

### Patrón Controller-Service (Separación de Responsabilidades)
- **`routes`**: Define endpoints, verbos HTTP y encadena middlewares de seguridad y validación.
- **`controllers`**: Extrae parámetros/cuerpo de la petición y envía respuestas de protocolo HTTP.
- **`services`**: Contiene la lógica pura de negocio y acceso a datos. No depende de los objetos `req` o `res` de Express, permitiendo que eventos externos (como el webhook de Stripe) invoquen `orderService.createOrder(...)` directamente de forma limpia.

---

## ✨ Funcionalidades y Experiencia de Usuario

### 🍿 Catálogo y Panel de Administración Exclusivo (`ADMIN`)
- Listado de películas con buscador reactivo por nombre y ordenación ascendente/descendente por precio o alfabético.
- Ficha de detalle de producto con control de stock, valoraciones promedio y sinopsis.
- **Panel de Administración Exclusivo (`ADMIN`)**: Únicamente los usuarios administradores pueden **Crear, Editar, Eliminar y Gestionar productos**. Los usuarios `USER` ven únicamente la interfaz de compra y catálogo sin controles de modificación.
- Formulario de productos con subida directa de archivos de imagen a Cloudinary.

### 🔐 Autenticación y Gestión de Perfiles
- Registro e Inicio de sesión con contraseñas encriptadas mediante Hash (`bcrypt`).
- Control de sesión transparente respaldado por **Cookie `httpOnly`**.
- Perfil propio editable (datos personales, avatar en Cloudinary y ficha de "Perfil Cinéfilo").
- Perfiles públicos de miembros de la comunidad accesibles desde sus valoraciones.

### 🛒 Carrito, Wishlist y Reseñas
- Carrito persistido en backend con sincronización inmediata en Redux.
- Control de stock disponible antes de añadir o incrementar cantidades.
- Lista de deseos (Wishlist) para guardar títulos favoritos.
- Sistema de reseñas y valoraciones (1-10 estrellas) con protección de permisos (solo el autor o admin puede editar/eliminar).

---

## 🔒 Decisiones de Seguridad y Mejores Prácticas

1. **JWT en Cookie `httpOnly` vs LocalStorage**:
   El token de autenticación se transmite exclusivamente mediante una cookie `httpOnly`, impidiendo su lectura por scripts del lado del cliente (`document.cookie`) y eliminando el riesgo de robo por vulnerabilidades XSS.
2. **Opciones de Cookie Seguras para Producción**:
   Las funciones de inicio de sesión (`login`), cierre de sesión (`logout`) y eliminación de cuenta (`deleteAccount`) utilizan una helper centralizada `getCookieOptions()` que configura:
   ```javascript
   {
     httpOnly: true,
     secure: process.env.NODE_ENV === "production",
     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
     maxAge: 2 * 60 * 60 * 1000
   }
   ```
   Esto asegura que los navegadores eliminen o mantengan la cookie correctamente al comunicarse entre dominios distintos (Netlify en el cliente ➔ Render en el servidor).
3. **Protección de Cabeceras (Helmet) y CORS en Lista Blanca**:
   - `helmet` aplica políticas CSP adaptadas para permitir fuentes de Swagger UI, Render y Netlify.
   - `cors` valida el origen de la petición mediante una función con regex para entornos locales y lista blanca para entornos de producción.
4. **Manejo Centralizado de Errores (`errorHandler.js`)**:
   Captura excepciones no controladas y errores conocidos de Prisma (`P2002`, `P2025`), respondiendo siempre con estructuras estándar y códigos HTTP apropiados.

---

## 💳 Pasarela de Pagos Stripe & Webhooks

El flujo de compras implementa el patrón de pago recomendado por Stripe:

```
[Usuario] ➔ [Carrito] ➔ [Checkout Page] ➔ [Stripe Elements (PaymentIntent)] ➔ [Stripe API]
                                                                                   │
                                                                           (Evento Webhook)
                                                                                   ▼
[Confirmación en UI] ◄────── (Polling) ────── [Base de Datos (Order + Stock)] ◄─── [Backend /api/webhooks/stripe]
```

1. **Cálculo de Importes en Servidor**: El frontend inicia el checkout solicitando un `PaymentIntent`. El backend calcula el importe exacto leyendo el carrito de la base de datos, previniendo manipulaciones del total desde el cliente.
2. **Firma y Parseo Raw del Webhook**: El endpoint `/api/webhooks/stripe` utiliza `express.raw({ type: 'application/json' })` antes del parser global de JSON, permitiendo verificar la firma criptográfica enviada por Stripe (`stripe.webhooks.constructEvent`).
3. **Idempotencia**: Para evitar duplicidad de pedidos si Stripe reintenta el webhook, se almacena el `stripePaymentIntentId` en el modelo `Order` y se comprueba su existencia antes de procesar el stock.
4. **Estrategia de Polling en Confirmación**: `CheckoutSuccessPage` realiza reintentos periódicos (cada 1.5s) consultando el pedido en la API para garantizar que el usuario vea la confirmación sin importar pequeñas latencias de la red de Stripe.

---

## 🎨 Estilos y Arquitectura CSS (CSS Modules)

El frontend ha sido completamente refactorizado para eliminar los estilos embebidos inline (`style={{ ... }}`), migrando la totalidad del diseño a **CSS Modules** (`*.module.css`):

- **Aislamiento de Clases**: Evita colisiones de nombres de clases globales en componentes como `ProductsPage`, `CreateProductPage`, `EditProductPage` y `RatingSummary`.
- **Variables CSS para Estilos Dinámicos**: En componentes con propiedades calculadas en tiempo de ejecución (como el porcentaje de las barras en `RatingSummary.jsx`), se pasan variables CSS (`style={{ '--bar-width': `${percentage}%` }}`), manteniendo toda la regla visual (`height`, `background`, `border-radius`, `width: var(--bar-width)`) declarada dentro de `RatingSummary.module.css`.

---

## 📄 Documentación API (Swagger / OpenAPI)

El backend expone una interfaz interactiva de Swagger UI donde se pueden probar y consultar todos los endpoints de la API:

```http
GET http://localhost:3000/api/docs
```

La especificación Swagger define los esquemas de petición, respuesta, parámetros de URL y códigos de retorno para todos los recursos del sistema.

---

## 🧪 Testing y Calidad de Código

El servidor backend dispone de una suite completa de pruebas de unidad e integración construida con **Jest + Supertest**:

```bash
cd project-break-2-backend
npm test
```

### Resultados de la Suite de Pruebas:
- **Test Suites**: **11/11 PASSED** (100% exitosas)
- **Tests Evaluados**: **88/88 PASSED**
- **Cobertura**: Controladores de carrito, stock de productos, órdenes de compra, autenticación, wishlist, reseñas y middleware de errores.

---

## 🔑 Variables de Entorno

### Backend (`project-break-2-backend/.env`)

```env
DATABASE_URL=postgresql://usuario:password@host:5432/dbname?schema=public
DIRECT_URL=postgresql://usuario:password@host:5432/dbname?schema=public

MONGODB_URI=mongodb+srv://...

CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_URL=cloudinary://...
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

JWT_SECRET=tu_clave_secreta_jwt
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

### Frontend (`SPRINT-FEATURES-13---16/.env`)

```env
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

---

## 🚀 Guía de Ejecución en Local

Para levantar el proyecto en tu entorno local, debes inicializar **3 procesos** en terminales simultáneas:

### Terminal 1 — Servidor Backend (API)
```bash
cd project-break-2-backend
npm install
npm run dev
```
*Servidor activo en http://localhost:3000*

### Terminal 2 — Aplicación Frontend (Vite)
```bash
cd SPRINT-FEATURES-13---16
npm install
npm run dev
```
*Aplicación web activa en http://localhost:5173 (o puerto asignado por Vite)*

### Terminal 3 — Escucha de Webhooks de Stripe (Stripe CLI)
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
*Copia el código `whsec_...` generado y actualiza la variable `STRIPE_WEBHOOK_SECRET` en el `.env` del backend.*

---

## 🌐 Despliegue en Producción

- **Frontend (Netlify)**: [https://projectbreak3.netlify.app](https://projectbreak3.netlify.app)
- **Backend (Render)**: [https://project-break-2-t70h.onrender.com](https://project-break-2-t70h.onrender.com)
- **Bases de Datos**: **Supabase** (PostgreSQL) y **MongoDB Atlas**
- **Webhook de Stripe**: Configurado en el Dashboard de Stripe (Developers ➔ Webhooks) apuntando a `https://project-break-2-t70h.onrender.com/api/webhooks/stripe` escuchando el evento `payment_intent.succeeded`.
