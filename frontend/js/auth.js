const API = 'http://localhost:3000/api';

function mostrarTab(tab) {
  document.getElementById('form-login').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('form-registro').style.display = tab === 'registro' ? 'block' : 'none';
  document.querySelectorAll('.tab').forEach((t, i) => {
    t.classList.toggle('active', (tab === 'login' && i === 0) || (tab === 'registro' && i === 1));
  });
  ocultarAlertas();
}

function mostrarAlerta(mensaje, tipo = 'danger') {
  const id = tipo === 'success' ? 'alerta-success' : 'alerta';
  const el = document.getElementById(id);
  el.textContent = mensaje;
  el.style.display = 'block';
}

function ocultarAlertas() {
  document.getElementById('alerta').style.display = 'none';
  document.getElementById('alerta-success').style.display = 'none';
}

async function iniciarSesion() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (!email || !password) {
    mostrarAlerta('Por favor completa todos los campos.');
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta(data.mensaje);
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    window.location.href = 'dashboard.html';

  } catch (error) {
    mostrarAlerta('Error de conexión con el servidor.');
  }
}

async function registrarse() {
  const nombre = document.getElementById('reg-nombre').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value.trim();
  const marca = document.getElementById('reg-marca').value.trim();
  const modelo = document.getElementById('reg-modelo').value.trim();
  const anio = document.getElementById('reg-anio').value.trim();
  const consumo = document.getElementById('reg-consumo').value.trim();

  if (!nombre || !email || !password || !marca || !modelo || !anio || !consumo) {
    mostrarAlerta('Por favor completa todos los campos.');
    return;
  }

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        email,
        password,
        vehiculo: {
          marca,
          modelo,
          anio: parseInt(anio),
          consumo_acpm_km: parseFloat(consumo)
        }
      })
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta(data.mensaje);
      return;
    }

    mostrarAlerta('¡Cuenta creada exitosamente! Ahora inicia sesión.', 'success');
    setTimeout(() => mostrarTab('login'), 2000);

  } catch (error) {
    mostrarAlerta('Error de conexión con el servidor.');
  }
}

// Si ya está logueado, ir al dashboard
if (localStorage.getItem('token')) {
  window.location.href = 'dashboard.html';
}