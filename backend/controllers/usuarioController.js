const Usuario = require('../models/Usuario');
const Propiedad = require('../models/Propiedad');

// Add property to favorites
const agregarFavorito = async (req, res) => {
  try {
    const { propiedad_id } = req.params;

    // Check if property exists
    const propiedad = await Propiedad.findById(propiedad_id);
    if (!propiedad) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    // Check if property is already in favorites
    const usuario = await Usuario.findById(req.usuario._id);
    if (usuario.favoritos.includes(propiedad_id)) {
      return res.status(400).json({ message: 'La propiedad ya está en favoritos' });
    }

    // Add to favorites
    usuario.favoritos.push(propiedad_id);
    await usuario.save();

    res.json({ message: 'Propiedad agregada a favoritos' });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar a favoritos' });
  }
};

// Remove property from favorites
const quitarFavorito = async (req, res) => {
  try {
    const { propiedad_id } = req.params;

    // Check if property exists
    const propiedad = await Propiedad.findById(propiedad_id);
    if (!propiedad) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    // Remove from favorites
    const usuario = await Usuario.findById(req.usuario._id);
    usuario.favoritos = usuario.favoritos.filter(
      fav => fav.toString() !== propiedad_id
    );
    await usuario.save();

    res.json({ message: 'Propiedad quitada de favoritos' });
  } catch (error) {
    res.status(500).json({ message: 'Error al quitar de favoritos' });
  }
};

// Get user's favorite properties
const getFavoritos = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id)
      .populate({
        path: 'favoritos',
        populate: {
          path: 'propietario',
          select: 'nombre email telefono'
        }
      });

    res.json(usuario.favoritos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener favoritos' });
  }
};

// Update user profile
const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, telefono } = req.body;
    const usuario = await Usuario.findById(req.usuario._id);

    if (nombre) usuario.nombre = nombre;
    if (telefono) usuario.telefono = telefono;

    await usuario.save();

    res.json({
      message: 'Perfil actualizado exitosamente',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};

module.exports = {
  agregarFavorito,
  quitarFavorito,
  getFavoritos,
  actualizarPerfil
}; 