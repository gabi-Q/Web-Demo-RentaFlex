import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Rampa de subida a 20 usuarios
    { duration: '1m', target: 20 }, // Mantener 20 usuarios por 1 minuto
    { duration: '30s', target: 0 }, // Rampa de bajada a 0 usuarios
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% de las peticiones deben completarse en menos de 500ms
    http_req_failed: ['rate<0.01'], // Menos del 1% de las peticiones pueden fallar
  },
};

const BASE_URL = 'http://localhost:5173';

export default function () {
  // Simular navegación de usuario
  const responses = http.batch([
    ['GET', `${BASE_URL}/`],
    ['GET', `${BASE_URL}/properties`],
    ['GET', `${BASE_URL}/properties/1`],
  ]);

  // Verificar respuestas
  responses.forEach((response, index) => {
    check(response, {
      [`status is 200 for request ${index}`]: (r) => r.status === 200,
      [`response time < 500ms for request ${index}`]: (r) => r.timings.duration < 500,
    });
  });

  sleep(1);
} 