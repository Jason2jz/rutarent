const express = require('express');
const router = express.Router();
const Calculadora = require('../models/Calculadora');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// CALCULAR RENTABILIDAD DE UNA OFERTA
router.post('/', async (req, res) => {
  try {
    const {
      origen,
      destino,
      distancia_km,
      valor_ofertado,
      peajes_estimados,
      viaticos_estimados
    } = req.body;

    const consumo_acpm_km = req.usuario.vehiculo.consumo_acpm_km;
    const precio_acpm = 10200;

    // Cálculos
    const litros_consumidos = distancia_km * consumo_acpm_km;
    const costo_acpm = litros_consumidos * precio_acpm;
    const costo_estimado = costo_acpm + peajes_estimados + viaticos_estimados;
    const ganancia_estimada = valor_ofertado - costo_estimado;
    const rentabilidad_porcentaje = ((ganancia_estimada / valor_ofertado) * 100).toFixed(2);
    const decision = ganancia_estimada > 0 ? 'ACEPTAR' : 'RECHAZAR';

    // Guardar en historial
    const calculo = new Calculadora({
      usuario_id: req.usuario.id,
      origen,
      destino,
      distancia_km,
      valor_ofertado,
      consumo_acpm_km,
      peajes_estimados,
      viaticos_estimados,
      costo_estimado,
      ganancia_estimada,
      rentabilidad_porcentaje,
      decision
    });

    await calculo.save();

    res.json({
      origen,
      destino,
      distancia_km,
      valor_ofertado,
      desglose: {
        costo_acpm: Math.round(costo_acpm),
        peajes_estimados,
        viaticos_estimados,
        costo_total: Math.round(costo_estimado)
      },
      ganancia_estimada: Math.round(ganancia_estimada),
      rentabilidad_porcentaje,
      decision
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor.', error: error.message });
  }
});

// HISTORIAL DE CÁLCULOS
router.get('/historial', async (req, res) => {
  try {
    const historial = await Calculadora.find({ usuario_id: req.usuario.id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(historial);

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor.', error: error.message });
  }
});

module.exports = router;