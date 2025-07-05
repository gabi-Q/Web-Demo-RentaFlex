# RentaFlex Backend

Backend API for RentaFlex, an Airbnb-like rental platform built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Property management (CRUD operations)
- Image upload with Cloudinary
- Reservation system
- Favorites management
- Search and filtering
- User profiles

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Create an `uploads` directory in the root folder:
   ```bash
   mkdir uploads
   ```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Properties
- GET `/api/propiedades` - Get all properties
- GET `/api/propiedades/buscar` - Search properties
- GET `/api/propiedades/:id` - Get property by ID
- POST `/api/propiedades` - Create new property
- PUT `/api/propiedades/:id` - Update property
- DELETE `/api/propiedades/:id` - Delete property

### Reservations
- GET `/api/reservas/mis-reservas` - Get user's reservations
- GET `/api/reservas/propiedad/:id` - Get property's reservations
- POST `/api/reservas` - Create reservation
- PUT `/api/reservas/:id/cancelar` - Cancel reservation

### User
- GET `/api/usuarios/favoritos` - Get user's favorites
- POST `/api/usuarios/favoritos/:propiedad_id` - Add to favorites
- DELETE `/api/usuarios/favoritos/:propiedad_id` - Remove from favorites
- PUT `/api/usuarios/perfil` - Update user profile

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security

- JWT authentication for protected routes
- Password hashing with bcrypt
- Environment variables for sensitive data
- CORS enabled
- Input validation
- File upload restrictions

## Deployment

The backend is configured for deployment on Render:
1. Connect your GitHub repository
2. Set environment variables
3. Set build command: `npm install`
4. Set start command: `npm start` 