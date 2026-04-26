const mongoose = require('mongoose');

const calculadoraSchema = new mongoose.Schema({
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
  valor_ofertado: {
    type: Number,
    required: true
  },
  consumo_acpm_km: {
    type: Number,
    required: true
  },
  peajes_estimados: {
    type: Number,
    default: 0
  },
  viaticos_estimados: {
    type: Number,
    default: 0
  },
  costo_estimado: {
    type: Number
  },
  ganancia_estimada: {
    type: Number
  },
  rentabilidad_porcentaje: {
    type: Number
  },
  decision: {
    type: String,
    enum: ['ACEPTAR', 'RECHAZAR']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Calculadora', calculadoraSchema);