# Librería Universal

Aplicación web para explorar el catálogo de una librería y administrar libros, categorías e inventario. El proyecto incluye un frontend con React y TypeScript, una API REST desarrollada con Laravel y una base de datos MySQL.

## Funcionalidades

### Tienda y catálogo

- Consulta de libros y categorías desde la API.
- Búsqueda de libros y filtros por categoría, precio y disponibilidad.
- Ordenamiento del catálogo y vista de obras destacadas.
- Detalle del libro con autor, sinopsis, precio, stock y portada.
- Portada de libro generada con diseño de encuadernación cuando el registro no tiene una imagen.

### Cuentas y autenticación

- Registro de clientes guardado en la base de datos.
- Inicio y cierre de sesión contra Laravel mediante tokens JWT.
- La interfaz determina si mostrar la tienda o el panel administrativo según el rol de la cuenta.
- El registro público crea usuarios con rol de cliente. Las cuentas administrativas y de bibliotecario deben crearse mediante los mecanismos autorizados del backend.

### Panel administrativo

- Consulta de libros, categorías y métricas de inventario.
- Creación, edición y eliminación de libros mediante la API.
- Ajuste de precio y stock con persistencia en MySQL.
- Creación y eliminación de categorías mediante la API.
- Valor del inventario calculado usando el precio y el número total de ejemplares.
- Acciones protegidas según el rol del usuario.

### Préstamos

El backend dispone de operaciones API para registrar préstamos, consultar préstamos y registrar devoluciones. El flujo de carrito y checkout del frontend todavía no utiliza esas operaciones.

## Tecnologías

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Motion

### Backend

- PHP 8.2 o superior.
- Laravel 10.
- MySQL.
- JWT para autenticación de la API.
- L5-Swagger para documentación OpenAPI.
- Apache en la imagen Docker del backend.

## Estructura del proyecto

```text
.
├── src/
│   ├── components/       # Tienda, formularios, modales y panel administrativo
│   ├── context/          # Estado compartido de la aplicación
│   ├── data/             # Datos iniciales de demostración
│   ├── lib/              # Cliente API y normalización de respuestas
│   └── types/            # Tipos TypeScript
├── backend/
│   ├── app/
│   │   ├── DTOs/         # Objetos de transferencia de datos
│   │   ├── Http/         # Controladores, middleware, requests y resources
│   │   ├── Models/       # Modelos Eloquent
│   │   ├── Repositories/ # Acceso a datos
│   │   └── Services/     # Lógica de negocio
│   ├── database/
│   │   ├── migrations/   # Estructura de tablas
│   │   └── seeders/      # Datos iniciales de demostración
│   ├── routes/api.php    # Rutas REST
│   └── Dockerfile        # Imagen PHP/Apache para despliegue
├── package.json
└── vite.config.ts
```

## Requisitos

- Node.js y npm.
- PHP 8.2 o superior.
- Composer.
- MySQL.
- MySQL Workbench es opcional y puede utilizarse para administrar la base de datos.

## Configuración local

### 1. Crear la base de datos

En MySQL Workbench, crea la base de datos:

```sql
CREATE DATABASE IF NOT EXISTS libreria_universal
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### 2. Configurar Laravel

Crea `backend/.env` a partir de `backend/.env.example` y configura la conexión:

```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=libreria_universal
DB_USERNAME=root
DB_PASSWORD=
```

Reemplaza `DB_USERNAME` y `DB_PASSWORD` con las credenciales de tu instalación de MySQL. No subas el archivo `.env` ni claves o contraseñas al repositorio.

Desde una terminal, instala las dependencias, prepara Laravel y ejecuta las migraciones y datos de ejemplo:

```bash
cd backend
composer install
php artisan key:generate
php artisan jwt:secret
php artisan migrate --seed
```

Las migraciones crean las tablas de usuarios, categorías, libros, préstamos y tablas auxiliares de Laravel. Los seeders cargan categorías, libros, usuarios de demostración y préstamos de ejemplo.

> Las contraseñas de los seeders son únicamente para desarrollo. No uses cuentas ni contraseñas de demostración en producción.

### 3. Iniciar el backend

Desde la carpeta `backend`:

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

La API local quedará disponible en `http://localhost:8000`.

### 4. Configurar e iniciar el frontend

Desde la carpeta principal instala dependencias:

```bash
npm install
```

En desarrollo, Vite reenvía las solicitudes que empiezan con `/api` a `http://localhost:8000`. Si configuras `VITE_API_URL`, utiliza la URL base del backend, sin añadir `/api/v1` al final.

Ejemplo de `.env` del frontend para usar el backend local directamente:

```env
VITE_API_URL=http://localhost:8000
```

También puedes dejar `VITE_API_URL` sin definir para usar el proxy de Vite.

Inicia el frontend en otra terminal desde la raíz:

```bash
npm run dev
```

Abre `http://localhost:3000`.

## API REST

La versión actual de la API utiliza el prefijo `/api/v1`.

### Autenticación

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Registrar un cliente |
| `POST` | `/api/v1/auth/login` | Iniciar sesión y recibir un JWT |
| `POST` | `/api/v1/auth/logout` | Cerrar sesión e invalidar el token |
| `POST` | `/api/v1/auth/refresh` | Renovar el token |
| `GET` | `/api/v1/auth/me` | Consultar el perfil autenticado |

### Libros

| Método | Ruta | Acceso |
|---|---|---|
| `GET` | `/api/v1/books` | Público |
| `GET` | `/api/v1/books?all=true` | Público; catálogo completo |
| `GET` | `/api/v1/books/{id}` | Público |
| `POST` | `/api/v1/books` | Administrador o bibliotecario |
| `PUT` | `/api/v1/books/{id}` | Administrador o bibliotecario |
| `PATCH` | `/api/v1/books/{id}` | Administrador o bibliotecario |
| `DELETE` | `/api/v1/books/{id}` | Administrador |

La lista de libros admite búsqueda, filtros, ordenamiento y paginación.

### Categorías

| Método | Ruta | Acceso |
|---|---|---|
| `GET` | `/api/v1/categories` | Público |
| `POST` | `/api/v1/categories` | Administrador o bibliotecario |
| `DELETE` | `/api/v1/categories/{id}` | Administrador o bibliotecario |

### Préstamos

| Método | Ruta | Acceso |
|---|---|---|
| `GET` | `/api/v1/me/loans` | Usuario autenticado; sus propios préstamos |
| `GET` | `/api/v1/loans/{id}` | Usuario autenticado; sujeto a autorización |
| `POST` | `/api/v1/loans` | Usuario autenticado |
| `GET` | `/api/v1/loans` | Administrador o bibliotecario |
| `PATCH` | `/api/v1/loans/{id}/return` | Administrador o bibliotecario |

El backend actualiza de forma transaccional las copias disponibles al prestar y devolver libros.

### Usuarios

| Método | Ruta | Acceso |
|---|---|---|
| `GET` | `/api/v1/users` | Administrador o bibliotecario |
| `GET` | `/api/v1/users/{id}` | Usuario autenticado; sujeto a autorización |
| `PUT` | `/api/v1/users/{id}` | Usuario autenticado; sujeto a autorización |
| `POST` | `/api/v1/users` | Administrador |
| `DELETE` | `/api/v1/users/{id}` | Administrador |

Las rutas protegidas requieren el encabezado:

```text
Authorization: Bearer <token>
```

## Documentación Swagger

Con el backend en ejecución, abre:

```text
http://localhost:8000/api/documentation
```

El documento OpenAPI JSON se sirve en:

```text
http://localhost:8000/docs?api-docs.json
```

Para regenerarlo después de modificar las anotaciones:

```bash
cd backend
php artisan l5-swagger:generate
```

## Estado de integración y limitaciones actuales

- El frontend carga libros y categorías desde Laravel.
- El registro y el inicio de sesión se validan contra el backend.
- El panel guarda en MySQL las altas, modificaciones y bajas de libros y categorías.
- Si el formulario de libro recibe una imagen cargada desde el dispositivo, solo se muestra una vista previa local. Para guardar una portada actualmente se necesita proporcionar una URL de imagen.
- La portada de la tarjeta **Libro Destacado del Mes** se determina usando el primer libro marcado como destacado; si ninguno está marcado, se utiliza el primer libro del catálogo.
- El apartado de selección de obras destacadas muestra libros que tienen una URL de imagen.
- El carrito, los cupones, el checkout, los pedidos y la edición del perfil siguen usando estado local del navegador. No representan compras o pedidos persistidos en la base de datos.
- Si la API del catálogo no está disponible, el frontend puede conservar los datos de demostración locales.

## Pruebas y validación

Desde la carpeta principal:

```bash
npm run lint
npm run build
```

Desde `backend`:

```bash
php artisan test
```

Las pruebas del backend utilizan una base SQLite en memoria según `backend/phpunit.xml`; no deberían alterar la base de datos MySQL local.

## Despliegue

El frontend y el backend se despliegan por separado:

- **Frontend:** Vercel, desde la raíz del repositorio.
- **Backend:** Render, usando el Dockerfile de `backend/`.

En Vercel configura la variable de entorno:

```env
VITE_API_URL=https://<url-publica-del-backend>
```

Debe ser el origen público del backend, sin `/api/v1` al final. Vuelve a desplegar el frontend después de cambiar variables `VITE_*`, porque Vite las incorpora durante la compilación.

En Render configura las variables de entorno de Laravel, incluyendo `APP_KEY`, `JWT_SECRET` y la conexión MySQL. No incluyas valores secretos en este README ni en el repositorio.

## Comandos útiles

Frontend:

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

Backend:

```bash
php artisan serve --host=0.0.0.0 --port=8000
php artisan migrate:status
php artisan route:list --path=api
php artisan test
php artisan l5-swagger:generate
```
````
