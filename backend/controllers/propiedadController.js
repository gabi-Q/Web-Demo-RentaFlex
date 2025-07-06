const Propiedad = require('../models/Property');
const { uploadImage, deleteImage } = require('../utils/cloudinary');

// Create new property
const crearPropiedad = async (req, res) => {
  try {
    const { titulo, tipo, precio_noche, descripcion, habitaciones, banos, area_m2, ubicacion } = req.body;
    const imagenes = req.files;

    // Upload images to Cloudinary
    const imagenesUrls = await Promise.all(
      imagenes.map(file => uploadImage(file.path))
    );

    const propiedad = new Propiedad({
      titulo,
      tipo,
      precio_noche,
      descripcion,
      habitaciones,
      banos,
      area_m2,
      imagenes: imagenesUrls,
      ubicacion,
      propietario: req.usuario._id
    });

    await propiedad.save();
    res.status(201).json(propiedad);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear propiedad' });
  }
};

// Get all properties with filters
const getPropiedades = async (req, res) => {
  try {
    const {
      tipo,
      precio_min,
      precio_max,
      habitaciones,
      banos,
      distrito,
      provincia,
      fecha_inicio,
      fecha_fin
    } = req.query;

    console.log('Query parameters recibidos:', req.query);
    const query = {};

    if (tipo) {
      const tipoFiltrado = tipo.toLowerCase();
      console.log('Filtrando por tipo:', tipoFiltrado);
      query.tipo = tipoFiltrado;
    }

    if (precio_min || precio_max) {
      query.precio_noche = {};
      if (precio_min) {
        query.precio_noche.$gte = Number(precio_min);
        console.log('Filtrando por precio mínimo:', precio_min);
      }
      if (precio_max) {
        query.precio_noche.$lte = Number(precio_max);
        console.log('Filtrando por precio máximo:', precio_max);
      }
    }

    if (habitaciones) {
      query.habitaciones = Number(habitaciones);
      console.log('Filtrando por habitaciones:', habitaciones);
    }

    if (banos) {
      query.banos = Number(banos);
      console.log('Filtrando por baños:', banos);
    }

    if (distrito) {
      query['ubicacion.distrito'] = { $regex: new RegExp(distrito.toLowerCase(), 'i') };
      console.log('Filtrando por distrito:', distrito);
    }

    if (provincia) {
      query['ubicacion.provincia'] = { $regex: new RegExp(provincia.toLowerCase(), 'i') };
      console.log('Filtrando por provincia:', provincia);
    }

    // Filter by availability
    if (fecha_inicio && fecha_fin) {
      query.disponibilidad = {
        $elemMatch: {
          inicio: { $lte: new Date(fecha_fin) },
          fin: { $gte: new Date(fecha_inicio) }
        }
      };
      console.log('Filtrando por disponibilidad:', { fecha_inicio, fecha_fin });
    }

    console.log('Query MongoDB:', JSON.stringify(query, null, 2));
    
    // Ejecutar la consulta y verificar los resultados
    const propiedades = await Propiedad.find(query)
      .populate('propietario', 'nombre email telefono');

    console.log('Propiedades encontradas:', propiedades.length);
    if (propiedades.length > 0) {
      console.log('Primera propiedad:', {
        tipo: propiedades[0].tipo,
        titulo: propiedades[0].titulo,
        precio_noche: propiedades[0].precio_noche,
        ubicacion: propiedades[0].ubicacion
      });
    } else {
      console.log('No se encontraron propiedades con los filtros aplicados');
    }

    res.json(propiedades);
  } catch (error) {
    console.error('Error en getPropiedades:', error);
    res.status(500).json({ message: 'Error al obtener propiedades' });
  }
};

// Get property by ID
const getPropiedadById = async (req, res) => {
  try {
    const propiedad = await Propiedad.findById(req.params.id)
      .populate('propietario', 'nombre email telefono');

    if (!propiedad) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    res.json(propiedad);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener propiedad' });
  }
};

// Update property
const actualizarPropiedad = async (req, res) => {
  try {
    const propiedad = await Propiedad.findById(req.params.id);

    if (!propiedad) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    // Check if user is the owner
    if (propiedad.propietario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const updates = req.body;
    if (req.files) {
      const imagenesUrls = await Promise.all(
        req.files.map(file => uploadImage(file.path))
      );
      updates.imagenes = imagenesUrls;
    }

    Object.assign(propiedad, updates);
    await propiedad.save();

    res.json(propiedad);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar propiedad' });
  }
};

// Delete property
const eliminarPropiedad = async (req, res) => {
  try {
    const propiedad = await Propiedad.findById(req.params.id);

    if (!propiedad) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    // Check if user is the owner
    if (propiedad.propietario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    // Delete images from Cloudinary
    await Promise.all(
      propiedad.imagenes.map(url => {
        const publicId = url.split('/').pop().split('.')[0];
        return deleteImage(publicId);
      })
    );

    await Propiedad.findByIdAndDelete(req.params.id);
    res.json({ message: 'Propiedad eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar propiedad' });
  }
};

// Search properties
const buscarPropiedades = async (req, res) => {
  try {
    const { q } = req.query;
    const propiedades = await Propiedad.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .populate('propietario', 'nombre email telefono');

    res.json(propiedades);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar propiedades' });
  }
};

// Get user properties
const getUserProperties = async (req, res) => {
  try {
    console.log('Buscando propiedades para usuario:', req.usuario._id);
    const propiedades = await Propiedad.find({ propietario: req.usuario._id });
    console.log('Propiedades encontradas:', propiedades);
    res.json(propiedades);
  } catch (error) {
    console.error('Error al obtener propiedades del usuario:', error);
    res.status(500).json({ 
      message: 'Error al obtener propiedades del usuario',
      error: error.message 
    });
  }
};

module.exports = {
  crearPropiedad,
  getPropiedades,
  getPropiedadById,
  actualizarPropiedad,
  eliminarPropiedad,
  buscarPropiedades,
  getUserProperties
};