const express = require('express');
const router = express.Router();
const multer = require('multer');
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

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadMulter = multer({ storage: storage });

// Public routes
router.get('/', getPropiedades);
router.get('/featured', async (req, res) => {
  try {
    const properties = await Property.find().limit(6);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/user', auth, getUserProperties);
router.get('/:id', getPropiedadById);

// Protected routes
router.post('/', auth, uploadMulter.array('imagenes', 5), handleUploadError, async (req, res) => {
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
router.put('/:id', auth, uploadMulter.array('imagenes', 5), actualizarPropiedad);
router.delete('/:id', auth, eliminarPropiedad);

module.exports = router; 