#!/bin/bash

# Configurar variables de entorno para pruebas
export PORT=3001
export MONGODB_URI_TEST=mongodb://localhost:27017/rentaflex_test
export JWT_SECRET=test_secret_key
export CLOUDINARY_CLOUD_NAME=test_cloud
export CLOUDINARY_API_KEY=test_key
export CLOUDINARY_API_SECRET=test_secret

# Ejecutar pruebas
npm test

# Ejecutar pruebas de carga
npm run load-test 