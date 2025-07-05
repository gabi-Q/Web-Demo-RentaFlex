const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  agregarFavorito,
  quitarFavorito,
  getFavoritos,
  actualizarPerfil
} = require('../controllers/usuarioController');

// All routes are protected
router.use(auth);

// Favorites management
router.get('/favoritos', getFavoritos);
router.post('/favoritos/:propiedad_id', agregarFavorito);
router.delete('/favoritos/:propiedad_id', quitarFavorito);

// Profile management
router.put('/perfil', actualizarPerfil);

module.exports = router; 