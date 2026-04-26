const mongoose = require('mongoose');

const viajeSchema = new mongoose.Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  origen: {
    type: String,
    required: true,
    trim: true
  },
  destino: {
    type: String,
    required: true,
    trim: true
  },
  distancia_km: {
    type: Number,
    required: true
  },
  tipo_carga: {
    type: String,
    required: true,
    enum: [
      'Ganado bovino',
      'Productos a granel',
      'Materiales de construcción',
      'Productos refrigerados',
      'Líquidos',
      'Carga general',
      'Otro'
    ]
  },
  fecha: {
    type: Date,
    required: true
  },
  valor_flete: {
    type: Number,
    required: true
  },
  gastos: {
    acpm: { type: Number, default: 0 },
    peajes: { type: Number, default: 0 },
    viaticos: { type: Number, default: 0 },
    imprevistos: { type: Number, default: 0 }
  },
  ganancia_neta: {
    type: Number
  },
  rentabilidad_porcentaje: {
    type: Number
  },
  estado: {
    type: String,
    enum: ['rentable', 'no rentable']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Viaje', viajeSchema);