const API = 'http://localhost:3000/api';
const token = localStorage.getItem('token');
const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

// Proteger ruta
if (!token) window.location.href = 'index.html';

// Mostrar nombre
document.getElementById('nombre-usuario').textContent = usuario.nombre?.split(' ')[0] || 'Transportador';

function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = 'index.html';
}

function formatPeso(valor) {
  return '$' + Math.round(valor).toLocaleString('es-CO');
}

async function cargarResumen() {
  try {
    const res = await fetch(`${API}/reportes/resumen`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    document.getElementById('total-viajes').textContent = data.totalViajes;
    document.getElementById('ingresos-brutos').textContent = formatPeso(data.ingresosBrutos);
    document.getElementById('total-gastos').textContent = formatPeso(data.totalGastos);
    document.getElementById('ganancia-neta').textContent = formatPeso(data.gananciaNeta);

    // Gráfica ingresos vs gastos
    new Chart(document.getElementById('grafica-ingresos'), {
      type: 'doughnut',
      data: {
        labels: ['Ganancia Neta', 'Total Gastos'],
        datasets: [{
          data: [data.gananciaNeta, data.totalGastos],
          backgroundColor: ['#28a745', '#dc3545'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });

  } catch (error) {
    console.error('Error cargando resumen:', error);
  }
}

async function cargarRutas() {
  try {
    const res = await fetch(`${API}/reportes/rutas`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const rutas = await res.json();

    const top5 = rutas.slice(0, 5);

    new Chart(document.getElementById('grafica-rutas'), {
      type: 'bar',
      data: {
        labels: top5.map(r => r.ruta),
        datasets: [{
          label: 'Ganancia neta (COP)',
          data: top5.map(r => r.gananciaTotalNeta),
          backgroundColor: '#e65c00',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            ticks: {
              callback: value => '$' + value.toLocaleString('es-CO')
            }
          }
        }
      }
    });

  } catch (error) {
    console.error('Error cargando rutas:', error);
  }
}

async function cargarViajesRecientes() {
  try {
    const res = await fetch(`${API}/viajes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const viajes = await res.json();

    const tbody = document.getElementById('tabla-viajes');

    if (viajes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#6c757d;">No hay viajes registrados aún. ¡Registra tu primer viaje!</td></tr>';
      return;
    }

    tbody.innerHTML = viajes.slice(0, 5).map(v => `
      <tr>
        <td><strong>${v.origen}</strong> → ${v.destino}</td>
        <td>${v.tipo_carga}</td>
        <td>${formatPeso(v.valor_flete)}</td>
        <td>${formatPeso(v.ganancia_neta)}</td>
        <td>
          <span class="badge ${v.estado === 'rentable' ? 'badge-success' : 'badge-danger'}">
            ${v.estado === 'rentable' ? '✅ Rentable' : '❌ No rentable'}
          </span>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Error cargando viajes:', error);
  }
}

// Cargar todo
cargarResumen();
cargarRutas();
cargarViajesRecientes();