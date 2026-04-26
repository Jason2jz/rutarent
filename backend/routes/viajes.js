const express = require('express');
const router = express.Router();
const Viaje = require('../models/Viaje');
const authMiddleware = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// REGISTRAR NUEVO VIAJE
router.post('/', async (req, res) => {
  try {
    const {
      origen,
      destino,
      distancia_km,
      tipo_carga,
      fecha,
      valor_flete,
      gastos
    } = req.body;

    const nuevoViaje = new Viaje({
      usuario_id: req.usuario.id,
      origen,
      destino,
      distancia_km,
      tipo_carga,
      fecha,
      valor_flete,
      gastos
    });

    // Calcular rentabilidad
    const total_gastos =
      nuevoViaje.gastos.acpm +
      nuevoViaje.gastos.peajes +
      nuevoViaje.gastos.viaticos +
      nuevoViaje.gastos.imprevistos;

    nuevoViaje.ganancia_neta = nuevoViaje.valor_flete - total_gastos;
    nuevoViaje.rentabilidad_porcentaje = parseFloat(((nuevoViaje.ganancia_neta / nuevoViaje.valor_flete) * 100).toFixed(2));
    nuevoViaje.estado = nuevoViaje.ganancia_neta > 0 ? 'rentable' : 'no rentable';

    await nuevoViaje.save();

    res.status(201).json({
      mensaje: 'Viaje registrado exitosamente.',
      viaje: nuevoViaje
    });

} catch (error) {
    console.error('❌ Error registrando viaje:', error.message);
    res.status(500).json({ mensaje: 'Error en el servidor.', error: error.message });
  }
});

// OBTENER TODOS LOS VIAJES
router.get('/', async (req, res) => {
  try {
    const viajes = await Viaje.find({ usuario_id: req.usuario.id })
      .sort({ fecha: -1 });

    res.json(viajes);

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor.', error: error.message });
  }
});

// OBTENER UN VIAJE ESPECÍFICO
router.get('/:id', async (req, res) => {
  try {
    const viaje = await Viaje.findOne({
      _id: req.params.id,
      usuario_id: req.usuario.id
    });

    if (!viaje) {
      return res.status(404).json({ mensaje: 'Viaje no encontrado.' });
    }

    res.json(viaje);

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor.', error: error.message });
  }
});

// ELIMINAR UN VIAJE
router.delete('/:id', async (req, res) => {
  try {
    const viaje = await Viaje.findOneAndDelete({
      _id: req.params.id,
      usuario_id: req.usuario.id
    });

    if (!viaje) {
      return res.status(404).json({ mensaje: 'Viaje no encontrado.' });
    }

    res.json({ mensaje: 'Viaje eliminado exitosamente.' });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor.', error: error.message });
  }
});

module.exports = router;