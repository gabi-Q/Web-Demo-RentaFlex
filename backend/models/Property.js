const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true
  },
  tipo: {
    type: String,
    required: [true, 'El tipo de propiedad es requerido'],
    enum: ['casa', 'apartamento', 'departamento']
  },
  precio_noche: {
    type: Number,
    required: [true, 'El precio por noche es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true
  },
  habitaciones: {
    type: Number,
    required: [true, 'El número de habitaciones es requerido'],
    min: [1, 'Debe tener al menos 1 habitación']
  },
  banos: {
    type: Number,
    required: [true, 'El número de baños es requerido'],
    min: [1, 'Debe tener al menos 1 baño']
  },
  area_m2: {
    type: Number,
    required: [true, 'El área es requerida'],
    min: [1, 'El área debe ser mayor a 0']
  },
  imagenes: [{
    type: String,
    required: [true, 'Al menos una imagen es requerida']
  }],
  ubicacion: {
    distrito: {
      type: String,
      required: [true, 'El distrito es requerido']
    },
    provincia: {
      type: String,
      required: [true, 'La provincia es requerida']
    }
  },
  disponibilidad: [{
    inicio: {
      type: Date,
      required: true
    },
    fin: {
      type: Date,
      required: true
    }
  }],
  estado: {
    type: String,
    enum: ['disponible', 'no_disponible'],
    default: 'disponible'
  },
  propietario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
}, {
  timestamps: true,
  collection: 'propiedades'
});

// Index for search functionality
propertySchema.index({ 
  'titulo': 'text', 
  'descripcion': 'text',
  'ubicacion.distrito': 'text',
  'ubicacion.provincia': 'text'
});

module.exports = mongoose.model('Propiedad', propertySchema); 