Backend API para RentaFlex, una plataforma de alquiler similar a Airbnb construida con Node.js, Express y MongoDB.

## Características

- Autenticación de usuario con JWT
- Gestión de propiedades (operaciones CRUD)
- Carga de imágenes con Cloudinary
- Sistema de reservas
- Gestión de favoritos
- Búsqueda y filtrado
- Perfiles de usuario

## Requisitos previos

- Node.js (v14 o superior)
- Cuenta de MongoDB Atlas
- Cuenta de Cloudinary

## Configuración

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en el directorio raíz con las siguientes variables:
   ```
   MONGODB_URI=tu_uri_mongodb
   JWT_SECRET=tu_secreto_jwt
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=tu_nombre_de_nube_cloudinary
   CLOUDINARY_API_KEY=tu_clave_api_cloudinary
   CLOUDINARY_API_SECRET=tu_secreto_api_cloudinary
   FRONTEND_URL=tu_url_frontend
   ```
4. Crea un directorio `uploads` en la carpeta raíz:
   ```bash
   mkdir uploads
   ```

## Ejecutando la aplicación

Modo desarrollo:
```bash
npm run dev
```

Modo producción:
```bash
npm start
```

## Endpoints de la API

### Autenticación
- POST `/api/auth/register` - Registrar nuevo usuario
- POST `/api/auth/login` - Iniciar sesión de usuario
- GET `/api/auth/me` - Obtener usuario actual

### Propiedades
- GET `/api/propiedades` - Obtener todas las propiedades
- GET `/api/propiedades/buscar` - Buscar propiedades
- GET `/api/propiedades/:id` - Obtener propiedad por ID
- POST `/api/propiedades` - Crear nueva propiedad
- PUT `/api/propiedades/:id` - Actualizar propiedad
- DELETE `/api/propiedades/:id` - Eliminar propiedad

### Reservas
- GET `/api/reservas/mis-reservas` - Obtener reservas del usuario
- GET `/api/reservas/propiedad/:id` - Obtener reservas de la propiedad
- POST `/api/reservas` - Crear reserva
- PUT `/api/reservas/:id/cancelar` - Cancelar reserva

### Usuario
- GET `/api/usuarios/favoritos` - Obtener favoritos del usuario
- POST `/api/usuarios/favoritos/:propiedad_id` - Añadir a favoritos
- DELETE `/api/usuarios/favoritos/:propiedad_id` - Eliminar de favoritos
- PUT `/api/usuarios/perfil` - Actualizar perfil de usuario

## Manejo de errores

La API utiliza códigos de estado HTTP estándar:
- 200: Éxito
- 201: Creado
- 400: Solicitud incorrecta
- 401: No autorizado
- 403: Prohibido
- 404: No encontrado
- 500: Error interno del servidor

## Seguridad

- Autenticación JWT para rutas protegidas
- Hash de contraseñas con bcrypt
- Variables de entorno para datos sensibles
- CORS habilitado
- Validación de entrada
- Restricciones de carga de archivos

## Despliegue

El backend está configurado para el despliegue en Render:
1. Conecta tu repositorio de GitHub
2. Establece las variables de entorno
3. Establece el comando de construcción: `npm install`
4. Establece el comando de inicio: `npm start`