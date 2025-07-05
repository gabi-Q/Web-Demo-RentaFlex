const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  propiedad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Propiedad',
    required: true
  },
  desde: {
    type: Date,
    required: [true, 'La fecha de inicio es requerida']
  },
  hasta: {
    type: Date,
    required: [true, 'La fecha de fin es requerida']
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'cancelada'],
    default: 'pendiente'
  },
  precio_total: {
    type: Number,
    required: true
  },
  noches: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Validate that hasta is after desde
reservaSchema.pre('save', function(next) {
  if (this.desde >= this.hasta) {
    next(new Error('La fecha de fin debe ser posterior a la fecha de inicio'));
  }
  next();
});

// Calculate total price and nights
reservaSchema.pre('save', async function(next) {
  try {
    const propiedad = await mongoose.model('Propiedad').findById(this.propiedad);
    if (!propiedad) {
      throw new Error('Propiedad no encontrada');
    }

    const diffTime = Math.abs(this.hasta - this.desde);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    this.noches = diffDays;
    this.precio_total = diffDays * propiedad.precio_noche;
    
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Reserva', reservaSchema); 