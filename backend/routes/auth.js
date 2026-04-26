const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// REGISTRO
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, vehiculo } = req.body;

    // Verificar si el email ya existe
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ mensaje: 'El email ya está registrado.' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordHash,
      vehiculo
    });

    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente.' });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor.', error: error.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Email o contraseña incorrectos.' });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(400).json({ mensaje: 'Email o contraseña incorrectos.' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: usuario._id, 
        nombre: usuario.nombre,
        vehiculo: usuario.vehiculo
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        vehiculo: usuario.vehiculo
      }
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor.', error: error.message });
  }
});

module.exports = router;