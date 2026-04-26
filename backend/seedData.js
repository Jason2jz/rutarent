const mongoose = require('mongoose');
const Viaje = require('./models/Viaje');
require('dotenv').config();

const viajes = [
  {
    origen: 'Cereté', destino: 'Medellín', distancia_km: 420,
    tipo_carga: 'Ganado bovino', fecha: new Date('2026-04-01'),
    valor_flete: 3200000,
    gastos: { acpm: 588000, peajes: 180000, viaticos: 120000, imprevistos: 50000 }
  },
  {
    origen: 'Montería', destino: 'Bogotá', distancia_km: 650,
    tipo_carga: 'Carga general', fecha: new Date('2026-04-03'),
    valor_flete: 4500000,
    gastos: { acpm: 910000, peajes: 280000, viaticos: 180000, imprevistos: 80000 }
  },
  {
    origen: 'Cereté', destino: 'Barranquilla', distancia_km: 180,
    tipo_carga: 'Productos a granel', fecha: new Date('2026-04-05'),
    valor_flete: 1800000,
    gastos: { acpm: 252000, peajes: 90000, viaticos: 60000, imprevistos: 30000 }
  },
  {
    origen: 'Montería', destino: 'Cartagena', distancia_km: 200,
    tipo_carga: 'Líquidos', fecha: new Date('2026-04-08'),
    valor_flete: 2100000,
    gastos: { acpm: 280000, peajes: 100000, viaticos: 70000, imprevistos: 40000 }
  },
  {
    origen: 'Cereté', destino: 'Medellín', distancia_km: 420,
    tipo_carga: 'Ganado bovino', fecha: new Date('2026-04-10'),
    valor_flete: 3400000,
    gastos: { acpm: 588000, peajes: 180000, viaticos: 130000, imprevistos: 60000 }
  },
  {
    origen: 'Cereté', destino: 'Bogotá', distancia_km: 650,
    tipo_carga: 'Productos refrigerados', fecha: new Date('2026-04-12'),
    valor_flete: 5200000,
    gastos: { acpm: 910000, peajes: 280000, viaticos: 200000, imprevistos: 100000 }
  },
  {
    origen: 'Lorica', destino: 'Barranquilla', distancia_km: 210,
    tipo_carga: 'Carga general', fecha: new Date('2026-04-14'),
    valor_flete: 900000,
    gastos: { acpm: 294000, peajes: 110000, viaticos: 80000, imprevistos: 600000 }
  },
  {
    origen: 'Montería', destino: 'Medellín', distancia_km: 390,
    tipo_carga: 'Materiales de construcción', fecha: new Date('2026-04-16'),
    valor_flete: 2800000,
    gastos: { acpm: 546000, peajes: 160000, viaticos: 110000, imprevistos: 50000 }
  },
  {
    origen: 'Cereté', destino: 'Cartagena', distancia_km: 220,
    tipo_carga: 'Productos a granel', fecha: new Date('2026-04-18'),
    valor_flete: 2200000,
    gastos: { acpm: 308000, peajes: 110000, viaticos: 75000, imprevistos: 35000 }
  },
  {
    origen: 'Montería', destino: 'Bogotá', distancia_km: 650,
    tipo_carga: 'Ganado bovino', fecha: new Date('2026-04-20'),
    valor_flete: 4800000,
    gastos: { acpm: 910000, peajes: 280000, viaticos: 190000, imprevistos: 90000 }
  }
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Obtener el usuario Jason
    const Usuario = require('./models/Usuario');
    const usuario = await Usuario.findOne({ email: 'jason@rutarent.com' });

    if (!usuario) {
      console.log('❌ Usuario no encontrado. Asegúrate de estar registrado.');
      process.exit(1);
    }

    console.log(`✅ Usuario encontrado: ${usuario.nombre}`);

    // Insertar viajes
    for (const v of viajes) {
      const viaje = new Viaje({
        ...v,
        usuario_id: usuario._id
      });

      const total_gastos = viaje.gastos.acpm + viaje.gastos.peajes + viaje.gastos.viaticos + viaje.gastos.imprevistos;
      viaje.ganancia_neta = viaje.valor_flete - total_gastos;
      viaje.rentabilidad_porcentaje = parseFloat(((viaje.ganancia_neta / viaje.valor_flete) * 100).toFixed(2));
      viaje.estado = viaje.ganancia_neta > 0 ? 'rentable' : 'no rentable';

      await viaje.save();
      console.log(`✅ Viaje ${viaje.origen} → ${viaje.destino} registrado. Ganancia: $${Math.round(viaje.ganancia_neta).toLocaleString('es-CO')}`);
    }

    console.log('\n🚛 ¡Datos de prueba cargados exitosamente!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedData();