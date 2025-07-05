const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  crearReserva,
  getMisReservas,
  getReservasPropiedad,
  cancelarReserva
} = require('../controllers/reservaController');

// All routes are protected
router.use(auth);

// User's reservations
router.get('/mis-reservas', getMisReservas);

// Property's reservations
router.get('/propiedad/:id', getReservasPropiedad);

// Create and manage reservations
router.post('/', crearReserva);
router.put('/:id/cancelar', cancelarReserva);

module.exports = router; 