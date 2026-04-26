const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/viajes', require('./routes/viajes'));
app.use('/api/reportes', require('./routes/reportes'));
app.use('/api/calculadora', require('./routes/calculadora'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'RutaRent API funcionando 🚛' });
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`🚛 RutaRent corriendo en puerto ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error conectando a MongoDB:', error.message);
  });