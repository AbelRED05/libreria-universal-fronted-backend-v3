Aquí tienes una versión en español, lista para copiar y pegar en tu `README.md`. Describe las funciones actuales y aclara qué partes todavía funcionan localmente:

```markdown
# Librería Universal

Sistema web para la gestión de una librería y biblioteca. Permite consultar un catálogo de libros, gestionar categorías e inventario y registrar usuarios. Está compuesto por un frontend en React y una API backend en Laravel conectada a MySQL.

## Funcionalidades

### Catálogo y tienda
- Consulta de libros y categorías desde la API de Laravel.
- Búsqueda, filtros y ordenamiento del catálogo.
- Vista de libros destacados y detalle de cada obra.
- Carrito de compras y experiencia de compra de demostración.

### Autenticación y usuarios
- Registro de cuentas de cliente, almacenadas en MySQL.
- Inicio de sesión validado por el backend mediante JWT.
- El acceso al panel depende del rol guardado para el usuario.
- Los administradores pueden gestionar el catálogo; las cuentas nuevas se registran como clientes.

### Panel administrativo
- Consulta del inventario y sus métricas.
- Creación, edición y eliminación de libros.
- Ajuste de precios y existencias.
- Creación y eliminación de categorías.
- Las operaciones de libros y categorías se envían a la API y se guardan en MySQL.
- El valor del inventario se calcula usando el precio y el número total de ejemplares.

### Backend
La API incluye endpoints para autenticación, libros, categorías, usuarios y préstamos. Aunque existen endpoints para préstamos y otras operaciones, no todos están conectados actualmente a la interfaz frontend.

## Tecnologías

- **Frontend:** React, TypeScript, Vite y Tailwind CSS.
- **Backend:** PHP, Laravel y API REST.
- **Autenticación:** JWT.
- **Base de datos:** MySQL.
- **Diseño:** componentes de interfaz con Lucide Icons y Motion.

## Requisitos

- Node.js y npm.
- PHP 8.2 o superior.
- Composer.
- MySQL y MySQL Workbench (opcional, para administrar la base de datos).

## Configuración local

### 1. Crear la base de datos

En MySQL Workbench, ejecuta:

```sql
CREATE DATABASE IF NOT EXISTS libreria_universal
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### 2. Configurar Laravel

Abre `backend/.env` y configura los datos de conexión de MySQL:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=libreria_universal
DB_USERNAME=root
DB_PASSWORD=
```

Si tu usuario de MySQL tiene contraseña, escríbela en `DB_PASSWORD`.

Desde la carpeta `backend`, instala las dependencias, genera la clave de Laravel, ejecuta las migraciones y carga los datos de ejemplo:

```bash
cd backend
composer install
php artisan key:generate
php artisan migrate --seed
```

El seeder incluye cuentas de demostración. Las credenciales configuradas actualmente son:

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@universal.com` | `admin123` |
| Bibliotecario | `biblioteca@universal.com` | `biblioteca123` |
| Cliente | `lector@universal.com` | `lector123` |

Estas credenciales son solo para desarrollo. Cámbialas antes de publicar el sistema.

### 3. Instalar dependencias del frontend

Desde la carpeta principal del proyecto:

```bash
npm install --legacy-peer-deps
```

El parámetro `--legacy-peer-deps` puede ser necesario para resolver las versiones de dependencias definidas actualmente en el proyecto.

### 4. Iniciar el backend

Desde la carpeta `backend`:

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

La API quedará disponible en `http://localhost:8000`.

### 5. Iniciar el frontend

En otra terminal, desde la carpeta principal:

```bash
npm run dev
```

Abre `http://localhost:3000` en el navegador. Vite reenvía las solicitudes `/api` al backend en el puerto `8000`.

## Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Registrar una cuenta de cliente |
| `POST` | `/api/v1/auth/login` | Iniciar sesión y obtener un token JWT |
| `GET` | `/api/v1/auth/me` | Consultar el perfil autenticado |
| `GET` | `/api/v1/books?all=true` | Consultar el catálogo completo |
| `POST` | `/api/v1/books` | Crear un libro (requiere rol autorizado) |
| `PUT` | `/api/v1/books/{id}` | Actualizar un libro (requiere rol autorizado) |
| `DELETE` | `/api/v1/books/{id}` | Eliminar un libro (requiere rol administrador) |
| `GET` | `/api/v1/categories` | Consultar las categorías |
| `POST` | `/api/v1/categories` | Crear una categoría (requiere rol autorizado) |
| `DELETE` | `/api/v1/categories/{id}` | Eliminar una categoría (requiere rol autorizado) |

Las rutas protegidas requieren un token JWT en el encabezado `Authorization: Bearer <token>`.

## Estado de integración

La autenticación, el catálogo, la gestión de libros y la gestión de categorías están conectados con la API de Laravel. El carrito, los cupones y el checkout todavía usan estado local del navegador; no deben considerarse operaciones de compra persistidas en MySQL. La carga de portadas desde archivos locales solo genera una vista previa; para persistir una portada debe usarse una URL de imagen.

## Comandos útiles

Desde la carpeta principal:

```bash
npm run dev
npm run lint
npm run build
```

Desde `backend`:

```bash
php artisan serve
php artisan migrate:status
php artisan route:list --path=api
```
```

Nota: en la tabla de endpoints, el rol bibliotecario puede crear y editar libros y gestionar categorías; eliminar libros está restringido al administrador. También conviene no publicar las credenciales de demostración en un entorno real.
