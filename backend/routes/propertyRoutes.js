const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload, handleUploadError } = require('../utils/cloudinary');
const Property = require('../models/Property');
const { 
  crearPropiedad, 
  getPropiedades, 
  getPropiedadById, 
  actualizarPropiedad, 
  eliminarPropiedad, 
  buscarPropiedades,
  getUserProperties 
} = require('../controllers/propiedadController');

// Crear una nueva propiedad
router.post('/', auth, upload.array('imagenes', 5), handleUploadError, async (req, res) => {
  try {
    console.log('Headers recibidos:', req.headers);
    console.log('Archivos recibidos:', req.files);
    console.log('Datos del formulario:', req.body);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Se requiere al menos una imagen' });
    }

    const propertyData = {
      ...req.body,
      imagenes: req.files.map(file => file.path),
      propietario: req.usuario._id
    };

    // Parsear campos JSON
    try {
      if (propertyData.ubicacion) {
        propertyData.ubicacion = JSON.parse(propertyData.ubicacion);
      }
      if (propertyData.disponibilidad) {
        propertyData.disponibilidad = JSON.parse(propertyData.disponibilidad);
      }
    } catch (error) {
      console.error('Error al parsear JSON:', error);
      return res.status(400).json({ message: 'Error en el formato de los datos' });
    }

    console.log('Datos procesados:', propertyData);

    const property = new Property(propertyData);
    await property.save();

    console.log('Propiedad creada:', property);
    res.status(201).json(property);
  } catch (error) {
    console.error('Error al crear propiedad:', error);
    res.status(500).json({ 
      message: 'Error al crear la propiedad',
      error: error.message
    });
  }
});

// Obtener todas las propiedades
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener propiedades destacadas
router.get('/featured', async (req, res) => {
  try {
    const properties = await Property.find().limit(6);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener propiedades del usuario
router.get('/user', auth, getUserProperties);

// Obtener una propiedad por ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar una propiedad
router.put('/:id', auth, upload.array('imagenes', 5), handleUploadError, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    if (property.propietario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ message: 'No autorizado para modificar esta propiedad' });
    }

    const updateData = { ...req.body };
    if (req.files && req.files.length > 0) {
      updateData.imagenes = req.files.map(file => file.path);
    }

    // Parsear campos JSON
    if (updateData.ubicacion) {
      updateData.ubicacion = JSON.parse(updateData.ubicacion);
    }
    if (updateData.disponibilidad) {
      updateData.disponibilidad = JSON.parse(updateData.disponibilidad);
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar una propiedad
router.delete('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    if (property.propietario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ message: 'No autorizado para eliminar esta propiedad' });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Propiedad eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;