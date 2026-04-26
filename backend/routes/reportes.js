const express = require('express');
const router = express.Router();
const Viaje = require('../models/Viaje');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// RESUMEN DEL MES ACTUAL
router.get('/resumen', async (req, res) => {
  try {
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);

    const viajes = await Viaje.find({
      usuario_id: req.usuario.id,
      fecha: { $gte: inicioMes, $lte: finMes }
    });

    const totalViajes = viajes.length;
    const ingresosBrutos = viajes.reduce((acc, v) => acc + v.valor_flete, 0);
    const totalGastos = viajes.reduce((acc, v) => 
      acc + v.gastos.acpm + v.gastos.peajes + v.gastos.viaticos + v.gastos.imprevistos, 0);
    const gananciaNeta = viajes.reduce((acc, v) => acc + v.ganancia_neta, 0);
    const viajesRentables = viajes.filter(v => v.estado === 'rentable').length;
    const viajesNoRentables = viajes.filter(v => v.estado === 'no rentable').length;

    res.json({
      totalViajes,
      ingresosBrutos,
      totalGastos,
      gananciaNeta,
      viajesRentables,
      viajesNoRentables
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor.', error: error.message });
  }
});

// RUTAS MÁS Y MENOS RENTABLES
router.get('/rutas', async (req, res) => {
  try {
    const viajes = await Viaje.find({ usuario_id: req.usuario.id });

    // Agrupar por ruta origen-destino
    const rutasMap = {};
    viajes.forEach(v => {
      const key = `${v.origen} → ${v.destino}`;
      if (!rutasMap[key]) {
        rutasMap[key] = {
          ruta: key,
          totalViajes: 0,
          gananciaTotalNeta: 0,
          rentabilidadPromedio: 0
        };
      }
      rutasMap[key].totalViajes += 1;
      rutasMap[key].gananciaTotalNeta += v.ganancia_neta;
    });

    // Calcular rentabilidad promedio por ruta
    Object.values(rutasMap).forEach(r => {
      r.rentabilidadPromedio = (r.gananciaTotalNeta / r.totalViajes).toFixed(2);
    });

    const rutas = Object.values(rutasMap)
      .sort((a, b) => b.gananciaTotalNeta - a.gananciaTotalNeta);

    res.json(rutas);

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor.', error: error.message });
  }
});

module.exports = router;