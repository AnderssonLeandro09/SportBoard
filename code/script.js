// Script para navegación de paneles laterales (solo ejemplo, puedes expandirlo)
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.sidebar nav ul li a');
    const panels = document.querySelectorAll('.panel');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            links.forEach(l => l.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
            const target = this.getAttribute('href').replace('#', '');
            panels.forEach(panel => {
                if(panel.id === target) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });
        });
    });
});

// Navegación lateral funcional (corregida y robusta)
(function() {
  const sidebarLinks = document.querySelectorAll('.sidebar nav ul li a');
  const panels = document.querySelectorAll('.panel');
  function showPanel(target) {
    panels.forEach(panel => {
      if(panel.id === target) {
        panel.classList.add('active');
        panel.style.display = '';
      } else {
        panel.classList.remove('active');
        panel.style.display = 'none';
      }
    });
  }
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));
      this.parentElement.classList.add('active');
      const target = this.getAttribute('href').replace('#', '');
      showPanel(target);
      // Si es equipos, renderiza la tabla del primer equipo por defecto
      if(target === 'equipos') {
        const listaEquipos = document.getElementById('lista-equipos');
        if(listaEquipos) {
          const primerEquipo = listaEquipos.querySelector('.equipo-item');
          if (primerEquipo) {
            listaEquipos.querySelectorAll('.equipo-item').forEach(i=>i.classList.remove('active'));
            primerEquipo.classList.add('active');
            renderTablaAtletas(primerEquipo.dataset.equipo);
            agregarEventosAtletas();
            crearBotonNuevoAtleta();
          }
        }
      }
    });
  });
  // Inicializa solo el panel activo
  let anyActive = false;
  panels.forEach(panel => {
    if(panel.classList.contains('active')) {
      panel.style.display = '';
      anyActive = true;
    } else {
      panel.style.display = 'none';
    }
  });
  // Si ninguno está activo, activa el primero
  if(!anyActive && panels.length) {
    panels[0].classList.add('active');
    panels[0].style.display = '';
  }
})();

// Tabs para Competiciones y Equipos con paneles
function activarTabs(tabSelector, panelSelector) {
    document.querySelectorAll(tabSelector).forEach(tab => {
        tab.addEventListener('click', function() {
            const tabs = this.parentElement.querySelectorAll('.tab');
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            // Mostrar paneles si existieran (puedes expandir para más lógica)
            if (panelSelector) {
                const panels = this.parentElement.parentElement.querySelectorAll(panelSelector);
                panels.forEach((p, i) => {
                    p.style.display = (tabs[i] === this) ? '' : 'none';
                });
            }
        });
    });
}
activarTabs('.competiciones-tabs .tab');
activarTabs('.equipos-tabs .tab');

// Filtro de competiciones
const inputBuscar = document.querySelector('.input-buscar');
if(inputBuscar) {
    inputBuscar.addEventListener('input', function() {
        const valor = this.value.toLowerCase();
        document.querySelectorAll('#competiciones .tabla-resultados tbody tr').forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(valor) ? '' : 'none';
        });
    });
}

// Exportar datos (simulado)
const btnExportar = document.querySelector('.btn-exportar');
if(btnExportar) {
    btnExportar.addEventListener('click', function() {
        const mensaje = document.querySelector('.mensaje-exportar');
        mensaje.textContent = '¡Datos exportados correctamente!';
        setTimeout(()=>mensaje.textContent='', 3000);
    });
}

// Gráfico de línea (simulado)
const canvas = document.getElementById('graficoRendimiento');
if(canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#FFD600';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(10, 80);
    ctx.lineTo(50, 40);
    ctx.lineTo(90, 60);
    ctx.lineTo(130, 30);
    ctx.lineTo(170, 70);
    ctx.lineTo(210, 50);
    ctx.lineTo(250, 90);
    ctx.stroke();
}

// Guardar ajustes (simulado)
const formAjustes = document.querySelector('.form-ajustes');
if(formAjustes) {
    formAjustes.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('¡Ajustes guardados correctamente!');
    });
}

// Botón Nueva Competición: muestra un formulario modal y agrega la competición a la tabla
function crearModalNuevaCompeticion(data = {}) {
    if(document.getElementById('modal-nueva-competicion')) return;
    const modal = document.createElement('div');
    modal.id = 'modal-nueva-competicion';
    modal.innerHTML = `
      <div class="modal-bg"></div>
      <div class="modal-content">
        <h2>${data.modo==='editar' ? 'Editar' : 'Nueva'} Competición</h2>
        <form id="formNuevaCompeticion">
          <input type="text" name="nombre" placeholder="Nombre de la competición" required value="${data.nombre||''}">
          <input type="text" name="formato" placeholder="Formato (ej: Todos contra Todos)" required value="${data.formato||''}">
          <input type="date" name="inicio" placeholder="Fecha de inicio" required value="${data.inicio||''}">
          <input type="date" name="fin" placeholder="Fecha de fin" required value="${data.fin||''}">
          <button type="submit">${data.modo==='editar' ? 'Guardar Cambios' : 'Crear'}</button>
          <button type="button" id="cerrarModalNueva">Cancelar</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('cerrarModalNueva').onclick = () => modal.remove();
    document.querySelector('#formNuevaCompeticion').onsubmit = function(e) {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(this));
      if(data.modo==='editar' && data.tr) {
        const tds = data.tr.querySelectorAll('td');
        tds[0].textContent = formData.nombre;
        tds[1].textContent = formData.formato;
        tds[3].textContent = formData.inicio;
        tds[4].textContent = formData.fin;
      } else {
        agregarCompeticionATabla(formData);
      }
      modal.remove();
    };
}
function agregarCompeticionATabla(data) {
    const tbody = document.querySelector('#competiciones .tabla-resultados tbody');
    if (!tbody) return;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${data.nombre}</td>
      <td>${data.formato}</td>
      <td><span class="estado activo">Activa</span></td>
      <td>${data.inicio}</td>
      <td>${data.fin}</td>
      <td>
        <a href="#" class="btn-ver">Ver</a> |
        <a href="#" class="btn-editar">Editar</a> |
        <a href="#" class="btn-eliminar">Eliminar</a>
      </td>
    `;
    tr.querySelector('.btn-ver').addEventListener('click', function(e) {
      e.preventDefault();
      alert('Vista detallada próximamente.');
    });
    tr.querySelector('.btn-editar').addEventListener('click', function(e) {
      e.preventDefault();
      editarCompeticion(tr);
    });
    tr.querySelector('.btn-eliminar').addEventListener('click', function(e) {
      e.preventDefault();
      if(confirm('¿Seguro que deseas eliminar esta competición?')) tr.remove();
    });
    tbody.prepend(tr);
}

function editarCompeticion(tr) {
    const tds = tr.querySelectorAll('td');
    const nombre = tds[0].textContent;
    const formato = tds[1].textContent;
    const inicio = tds[3].textContent;
    const fin = tds[4].textContent;
    crearModalNuevaCompeticion({nombre, formato, inicio, fin, modo:'editar', tr});
}

// Estilos básicos para el modal
const style = document.createElement('style');
style.innerHTML = `
#modal-nueva-competicion {position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1000;display:flex;align-items:center;justify-content:center;}
#modal-nueva-competicion .modal-bg {position:absolute;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);}
#modal-nueva-competicion .modal-content {position:relative;background:#23272F;padding:2rem 2.5rem;border-radius:12px;z-index:2;box-shadow:0 4px 24px rgba(0,0,0,0.2);display:flex;flex-direction:column;gap:1rem;min-width:320px;}
#modal-nueva-competicion input {padding:0.7rem 1rem;border-radius:7px;border:none;font-size:1rem;background:#2C323C;color:#fff;margin-bottom:0.7rem;}
#modal-nueva-competicion button {margin-right:0.7rem;padding:0.7rem 1.5rem;border-radius:20px;border:none;font-size:1rem;font-weight:600;cursor:pointer;background:#2196F3;color:#fff;transition:background 0.2s;}
#modal-nueva-competicion button[type=button] {background:#757575;}
#modal-nueva-competicion button:hover {background:#1976d2;}
`;
document.head.appendChild(style);

// Botones Ver en tablas (simulado)
document.querySelectorAll('.tabla-resultados a').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Vista detallada próximamente.');
    });
});

// Tabs de Equipos (simulado, muestra alerta)
document.querySelectorAll('.equipos-tabs .tab').forEach(tab => {
    tab.addEventListener('click', function() {
        alert('Funcionalidad de pestañas de equipos próximamente.');
    });
});

// Datos de ejemplo para equipos y atletas
const equiposData = {
  'Leones': [
    {nombre:'Enner Valencia', posicion:'Delantero', ciclo:'Noveno Ciclo', estado:'Activo'},
    {nombre:'María López', posicion:'Portera', ciclo:'Tercer Ciclo', estado:'Activo'},
    {nombre:'Pedro Castillo', posicion:'Centro', ciclo:'Cuarto Ciclo', estado:'Inactivo'}
  ],
  'Tigres': [
    {nombre:'Ale Jaramillo', posicion:'Defensa', ciclo:'Octavo Ciclo', estado:'Activo'},
    {nombre:'Juan Pérez', posicion:'Extremo', ciclo:'Quinto Ciclo', estado:'Activo'}
  ],
  'Águilas': [
    {nombre:'Adrian Benavides', posicion:'Centro', ciclo:'Segundo Ciclo', estado:'Activo'},
    {nombre:'Lucía Torres', posicion:'Defensa', ciclo:'Séptimo Ciclo', estado:'Activo'}
  ],
  'Pumas': [
    {nombre:'Valentina Paredes', posicion:'Delantero', ciclo:'Primer Ciclo', estado:'Activo'},
    {nombre:'Sebastian Mendoza', posicion:'Defensa', ciclo:'Noveno Ciclo', estado:'Inactivo'}
  ]
};

function renderTablaAtletas(equipo) {
  const atletas = equiposData[equipo] || [];
  let html = `<h2>Lista del Equipo: ${equipo}</h2>
    <table class="tabla-resultados">
      <thead>
        <tr>
          <th>Nombre del Atleta</th>
          <th>Posición</th>
          <th>Ciclo</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${atletas.map(a => `
          <tr>
            <td>${a.nombre}</td>
            <td>${a.posicion}</td>
            <td>${a.ciclo}</td>
            <td><span class="estado ${a.estado.toLowerCase()}">${a.estado}</span></td>
            <td>
              <a href="#" class="btn-ver-atleta">Ver</a> |
              <a href="#" class="btn-editar-atleta">Editar</a> |
              <a href="#" class="btn-eliminar-atleta">Eliminar</a>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>`;
  document.getElementById('contenedor-atletas').innerHTML = html;
  agregarEventosAtletas();
}

// Selección de equipo: solo uno visible, cambiar con función
let equipoSeleccionado = 'Leones';
function renderEquipoSeleccionado(nombre) {
  equipoSeleccionado = nombre;
  document.getElementById('nombre-equipo').textContent = nombre;
  renderTablaAtletas(nombre);
}
// Render inicial
renderEquipoSeleccionado(equipoSeleccionado);
// Si quieres cambiar de equipo desde otro lugar, llama a renderEquipoSeleccionado('NombreEquipo');

// Cambiar equipo seleccionado
const listaEquipos = document.getElementById('lista-equipos');
if(listaEquipos) {
  listaEquipos.querySelectorAll('.equipo-item').forEach(item => {
    item.addEventListener('click', function() {
      listaEquipos.querySelectorAll('.equipo-item').forEach(i=>i.classList.remove('active'));
      this.classList.add('active');
      renderTablaAtletas(this.dataset.equipo);
      agregarEventosAtletas();
    });
  });
  // Renderiza la tabla del primer equipo por defecto
  const primerEquipo = listaEquipos.querySelector('.equipo-item');
  if (primerEquipo) {
    primerEquipo.classList.add('active');
    renderTablaAtletas(primerEquipo.dataset.equipo);
    agregarEventosAtletas();
  }
}

// Funcionalidad para editar y eliminar atletas en la tabla de equipos
function agregarEventosAtletas() {
  document.querySelectorAll('.btn-ver-atleta').forEach(btn => {
    btn.onclick = function(e) {
      e.preventDefault();
      alert('Vista detallada del atleta próximamente.');
    };
  });
  document.querySelectorAll('.btn-editar-atleta').forEach(btn => {
    btn.onclick = function(e) {
      e.preventDefault();
      editarAtleta(this.closest('tr'));
    };
  });
  document.querySelectorAll('.btn-eliminar-atleta').forEach(btn => {
    btn.onclick = function(e) {
      e.preventDefault();
      if(confirm('¿Seguro que deseas eliminar este atleta?')) this.closest('tr').remove();
    };
  });
}
function editarAtleta(tr) {
  const tds = tr.querySelectorAll('td');
  const nombre = tds[0].textContent;
  const posicion = tds[1].textContent;
  const ciclo = tds[2].textContent;
  const estado = tds[3].textContent.trim();
  crearModalEditarAtleta({nombre, posicion, ciclo, estado, tr});
}
function crearModalEditarAtleta(data) {
  if(document.getElementById('modal-editar-atleta')) return;
  const modal = document.createElement('div');
  modal.id = 'modal-editar-atleta';
  modal.innerHTML = `
    <div class="modal-bg"></div>
    <div class="modal-content">
      <h2>Editar Atleta</h2>
      <form id="formEditarAtleta">
        <input type="text" name="nombre" placeholder="Nombre del atleta" required value="${data.nombre||''}">
        <input type="text" name="posicion" placeholder="Posición" required value="${data.posicion||''}">
        <input type="text" name="ciclo" placeholder="Ciclo" required value="${data.ciclo||''}">
        <select name="estado">
          <option value="Activo" ${data.estado==='Activo'?'selected':''}>Activo</option>
          <option value="Inactivo" ${data.estado==='Inactivo'?'selected':''}>Inactivo</option>
        </select>
        <button type="submit">Guardar Cambios</button>
        <button type="button" id="cerrarModalEditarAtleta">Cancelar</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('cerrarModalEditarAtleta').onclick = () => modal.remove();
  document.querySelector('#formEditarAtleta').onsubmit = function(e) {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(this));
    const tds = data.tr.querySelectorAll('td');
    tds[0].textContent = formData.nombre;
    tds[1].textContent = formData.posicion;
    tds[2].textContent = formData.ciclo;
    tds[3].innerHTML = `<span class="estado ${formData.estado.toLowerCase()}">${formData.estado}</span>`;
    modal.remove();
  };
}

// Botón para agregar nuevo atleta al equipo seleccionado
function crearBotonNuevoAtleta() {
  let btn = document.getElementById('btn-nuevo-atleta');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'btn-nuevo-atleta';
    btn.textContent = 'Añadir Atleta';
    btn.className = 'btn-nueva';
    btn.style.marginBottom = '1rem';
    document.getElementById('contenedor-atletas').prepend(btn);
    btn.onclick = function() {
      crearModalNuevoAtleta();
    };
  }
}
function crearModalNuevoAtleta() {
  if(document.getElementById('modal-nuevo-atleta')) return;
  const modal = document.createElement('div');
  modal.id = 'modal-nuevo-atleta';
  modal.innerHTML = `
    <div class="modal-bg"></div>
    <div class="modal-content">
      <h2>Nuevo Atleta</h2>
      <form id="formNuevoAtleta">
        <input type="text" name="nombre" placeholder="Nombre del atleta" required>
        <input type="text" name="posicion" placeholder="Posición" required>
        <input type="text" name="ciclo" placeholder="Ciclo" required>
        <select name="estado">
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
        <button type="submit">Crear</button>
        <button type="button" id="cerrarModalNuevoAtleta">Cancelar</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('cerrarModalNuevoAtleta').onclick = () => modal.remove();
  document.querySelector('#formNuevoAtleta').onsubmit = function(e) {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(this));
    equiposData[equipoSeleccionado()].push(formData);
    renderTablaAtletas(equipoSeleccionado());
    agregarEventosAtletas();
    crearBotonNuevoAtleta();
    modal.remove();
  };
}
function equipoSeleccionado() {
  const active = document.querySelector('.equipo-item.active');
  return active ? active.dataset.equipo : Object.keys(equiposData)[0];
}
// Modifica renderTablaAtletas para incluir el botón
const _renderTablaAtletas = renderTablaAtletas;
renderTablaAtletas = function(equipo) {
  _renderTablaAtletas(equipo);
  crearBotonNuevoAtleta();
};

// Ejecutar al cargar
agregarEventosAtletas();
// Si agregas atletas dinámicamente, vuelve a llamar agregarEventosAtletas()
