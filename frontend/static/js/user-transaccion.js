document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://127.0.0.1:8080/api";
  const userId = sessionStorage.getItem("userId") || localStorage.getItem("userId");
  
  let todasLasTransacciones = [], transaccionesFiltradas = [];
  let paginaActual = 1, registrosPorPagina = 25;
  
  // -------- UTILIDADES --------
  const $ = (id) => document.getElementById(id);
  const hide = (el) => el?.classList.add("hidden");
  const show = (el) => el?.classList.remove("hidden");
  const setText = (id, text) => $(id) && ($(id).textContent = text);

  // Mapeo de tipos de métodos de pago
  const metodoPagoMap = {
    'tarjeta_credito': 'Tarjeta de Crédito',
    'tarjeta_debito': 'Tarjeta de Débito',
    'pse': 'PSE',
    'efectivo': 'Efectivo',
    'transferencia': 'Transferencia'
  };

  const estadoMap = {
    'completada': { text: 'Completada', color: 'green' },
    'pendiente': { text: 'Pendiente', color: 'yellow' },
    'fallida': { text: 'Fallida', color: 'red' },
    'cancelada': { text: 'Cancelada', color: 'gray' }
  };

  // -------- CARGA DE DATOS --------
  async function cargarDatosUsuario() {
    try {
      const res = await fetch(`${API_URL}/usuarios/${userId}`);
      if (!res.ok) return;
      const usuario = await res.json();
      setText("userNameDropdown", usuario.nombre || "Usuario");
      setText("userEmail", usuario.email || "");
      setText("saldo-actual", usuario.saldo?.toLocaleString() || "0");
    } catch (err) {
      console.error("Error al cargar usuario:", err);
    }
  }

  async function cargarHistorial() {
    try {
      mostrarSeccion("loading");
      
      // Cargar transacciones del usuario
      const resTransacciones = await fetch(`${API_URL}/transacciones/usuario/${userId}`);
      todasLasTransacciones = await resTransacciones.json();
      
      transaccionesFiltradas = [...todasLasTransacciones];
      
      todasLasTransacciones.length ? (mostrarSeccion("tabla"), actualizarEstadisticas(), aplicarFiltrosYOrdenamiento()) : mostrarSeccion("empty");
    } catch (err) {
      console.error("Error:", err);
      mostrarSeccion("empty");
    }
  }

  function mostrarSeccion(tipo) {
    const secciones = { loading: "loading-transacciones", empty: "empty-transacciones", tabla: "tabla-container" };
    Object.entries(secciones).forEach(([key, id]) => key === tipo ? show($(id)) : hide($(id)));
    tipo === "tabla" ? show($("paginacion-container")) : hide($("paginacion-container"));
  }

  // -------- ESTADÍSTICAS --------
  function actualizarEstadisticas() {
    const stats = todasLasTransacciones.reduce((acc, tx) => {
      if (tx.estado === 'completada') {
        acc.totalTransacciones++;
        acc.totalRecargado += tx.monto || 0;
      }
      return acc;
    }, { totalTransacciones: 0, totalRecargado: 0 });
    
    const promedioRecarga = stats.totalTransacciones > 0 ? stats.totalRecargado / stats.totalTransacciones : 0;
    
    setText("total-transacciones", stats.totalTransacciones);
    setText("total-recargado", stats.totalRecargado.toLocaleString());
    setText("promedio-recarga", Math.round(promedioRecarga).toLocaleString());
  }

  // -------- FILTROS Y ORDENAMIENTO --------
  function aplicarFiltrosYOrdenamiento() {
    const busqueda = $("buscar-transaccion").value.toLowerCase();
    const [criterio, direccion] = $("ordenar-por").value.split('-');
    
    transaccionesFiltradas = todasLasTransacciones.filter(tx => 
      !busqueda || tx.id_transaccion.toString().includes(busqueda)
    );
    
    transaccionesFiltradas.sort((a, b) => {
      let valorA, valorB;
      
      if (criterio === 'fecha') {
        valorA = new Date(a.fecha_trans).getTime();
        valorB = new Date(b.fecha_trans).getTime();
      } else if (criterio === 'monto') {
        valorA = a.monto || 0;
        valorB = b.monto || 0;
      }
      
      return direccion === 'desc' ? valorB - valorA : valorA - valorB;
    });
    
    paginaActual = 1;
    renderizarTabla();
  }

  // -------- RENDERIZADO DE TABLA --------
  function renderizarTabla() {
    const inicio = (paginaActual - 1) * registrosPorPagina;
    const transaccionesPagina = transaccionesFiltradas.slice(inicio, inicio + registrosPorPagina);
    
    $("tabla-body").innerHTML = transaccionesPagina.map(tx => {
      const fecha = new Date(tx.fecha_trans);
      const estado = estadoMap[tx.estado] || { text: tx.estado, color: 'gray' };
      const metodoPago = metodoPagoMap[tx.metodo_pago] || tx.metodo_pago;
      
      return `
        <tr class="bg-white hover:bg-gray-50 transition cursor-pointer" onclick="window.verDetalleTransaccion(${tx.id_transaccion})">
          <td class="px-6 py-4 font-medium text-gray-900">#${tx.id_transaccion}</td>
          <td class="px-6 py-4 text-gray-600">
            <div class="text-sm">${fecha.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
            <div class="text-xs text-gray-500">${fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</div>
          </td>
          <td class="px-6 py-4 font-semibold ${tx.estado === 'completada' ? 'text-green-600' : 'text-gray-600'}">
            ${(tx.monto || 0).toLocaleString()}
          </td>
          <td class="px-6 py-4 text-gray-600">${metodoPago}</td>
          <td class="px-6 py-4">
            <span class="px-2 py-1 text-xs font-semibold rounded-full bg-${estado.color}-100 text-${estado.color}-800">
              ${estado.text}
            </span>
          </td>
          <td class="px-6 py-4 text-center">
            <button onclick="event.stopPropagation(); window.verDetalleTransaccion(${tx.id_transaccion})" 
                    class="text-[#18C29C] hover:text-[#149E83] font-medium text-sm">Ver detalle</button>
          </td>
        </tr>
      `;
    }).join('');
    
    actualizarPaginacion();
    setText("contador-registros", `${transaccionesFiltradas.length} transacciones`);
  }

  // -------- PAGINACIÓN --------
  function actualizarPaginacion() {
    const totalPaginas = Math.ceil(transaccionesFiltradas.length / registrosPorPagina);
    const inicio = (paginaActual - 1) * registrosPorPagina + 1;
    const fin = Math.min(paginaActual * registrosPorPagina, transaccionesFiltradas.length);
    
    setText("pagina-actual", `Página ${paginaActual} de ${totalPaginas}`);
    setText("info-paginacion", `Mostrando ${inicio} a ${fin} de ${transaccionesFiltradas.length} registros`);
    
    $("btn-primera").disabled = $("btn-anterior").disabled = paginaActual === 1;
    $("btn-siguiente").disabled = $("btn-ultima").disabled = paginaActual === totalPaginas;
  }

  function cambiarPagina(nuevaPagina) {
    const totalPaginas = Math.ceil(transaccionesFiltradas.length / registrosPorPagina);
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      paginaActual = nuevaPagina;
      renderizarTabla();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // -------- MODAL DETALLE --------
  window.verDetalleTransaccion = function(idTransaccion) {
    const transaccion = todasLasTransacciones.find(tx => tx.id_transaccion === idTransaccion);
    if (!transaccion) return;
    
    const fecha = new Date(transaccion.fecha_trans);
    const estado = estadoMap[transaccion.estado] || { text: transaccion.estado, color: 'gray' };
    const metodoPago = metodoPagoMap[transaccion.metodo_pago] || transaccion.metodo_pago;
    
    $("modal-contenido").innerHTML = `
      <div class="bg-gradient-to-r from-[#18C29C] to-[#149E83] rounded-lg p-4 text-white mb-6">
        <h4 class="text-2xl font-bold mb-1">Transacción #${transaccion.id_transaccion}</h4>
        <p class="text-sm text-white/90">${fecha.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <h5 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <svg class="w-5 h-5 text-[#18C29C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Información de la Transacción
        </h5>
        <div class="grid grid-cols-2 gap-4">
          ${[
            ['Monto', `${(transaccion.monto || 0).toLocaleString()}`],
            ['Método de Pago', metodoPago],
            ['Estado', `<span class="px-2 py-1 text-xs font-semibold rounded-full bg-${estado.color}-100 text-${estado.color}-800">${estado.text}</span>`],
            ['Fecha y Hora', fecha.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })]
          ].map(([label, value]) => `
            <div><p class="text-xs text-gray-500 mb-1">${label}</p><p class="text-sm font-medium text-gray-800">${value}</p></div>
          `).join('')}
        </div>
      </div>

      ${transaccion.id_viaje ? `
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h5 class="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Asociada al Viaje
          </h5>
          <p class="text-sm text-gray-700">Esta transacción está asociada al <strong>Viaje #${transaccion.id_viaje}</strong></p>
          <button onclick="window.location.href='user-historial.html'" 
                  class="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">
            Ver detalles del viaje →
          </button>
        </div>
      ` : ''}

      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <h5 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <svg class="w-5 h-5 text-[#18C29C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Detalles Adicionales
        </h5>
        <div class="space-y-2 text-sm text-gray-600">
          <p><span class="font-medium">ID de Usuario:</span> ${transaccion.id_usuario}</p>
          ${transaccion.id_factura ? `<p><span class="font-medium">ID de Factura:</span> ${transaccion.id_factura}</p>` : ''}
          <p class="text-xs text-gray-500 mt-3">Transacción registrada el ${fecha.toLocaleString('es-CO')}</p>
        </div>
      </div>

      <div class="flex gap-3">
        ${transaccion.estado === 'completada' ? `
          <button onclick="window.descargarComprobante(${transaccion.id_transaccion})" 
                  class="flex-1 bg-[#18C29C] hover:bg-[#149E83] text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Descargar Comprobante
          </button>
        ` : ''}
        <button onclick="document.getElementById('cerrar-modal').click()" 
                class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition">Cerrar</button>
      </div>
    `;
    
    show($("modal-detalle"));
  };

  window.descargarComprobante = (idTransaccion) => alert(`Descargando comprobante de transacción #${idTransaccion}...`);

  // -------- EVENT LISTENERS --------
  const eventos = {
    "cerrar-modal": () => hide($("modal-detalle")),
    "buscar-transaccion": aplicarFiltrosYOrdenamiento,
    "ordenar-por": aplicarFiltrosYOrdenamiento,
    "registros-por-pagina": (e) => {
      registrosPorPagina = parseInt(e.target.value);
      paginaActual = 1;
      renderizarTabla();
    },
    "btn-primera": () => cambiarPagina(1),
    "btn-anterior": () => cambiarPagina(paginaActual - 1),
    "btn-siguiente": () => cambiarPagina(paginaActual + 1),
    "btn-ultima": () => cambiarPagina(Math.ceil(transaccionesFiltradas.length / registrosPorPagina)),
    "logoutBtn": (e) => {
      e.preventDefault();
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "index.html";
    }
  };

  Object.entries(eventos).forEach(([id, handler]) => {
    const el = $(id);
    if (el) {
      const eventType = ["buscar-transaccion"].includes(id) ? "input" : ["ordenar-por", "registros-por-pagina"].includes(id) ? "change" : "click";
      el.addEventListener(eventType, handler);
    }
  });
  
  $("modal-detalle")?.addEventListener("click", (e) => e.target === $("modal-detalle") && hide($("modal-detalle")));
  document.addEventListener("keydown", (e) => e.key === "Escape" && !$("modal-detalle")?.classList.contains("hidden") && hide($("modal-detalle")));

  // -------- INICIALIZAR --------
  (async () => {
    await cargarDatosUsuario();
    await cargarHistorial();
  })();
});