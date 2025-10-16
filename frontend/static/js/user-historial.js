document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://127.0.0.1:8080/api";
  const userId = sessionStorage.getItem("userId") || localStorage.getItem("userId");
  
  let todosLosViajes = [], viajesFiltrados = [], facturasData = [];
  let paginaActual = 1, registrosPorPagina = 25;
  
  // -------- UTILIDADES --------
  const $ = (id) => document.getElementById(id);
  const hide = (el) => el?.classList.add("hidden");
  const show = (el) => el?.classList.remove("hidden");
  const setText = (id, text) => $(id) && ($(id).textContent = text);
  const calcularDuracion = (inicio, fin) => inicio && fin ? Math.round((new Date(fin) - new Date(inicio)) / 60000) : 0;

  // -------- CARGA DE DATOS --------
  async function cargarDatosUsuario() {
    try {
      const res = await fetch(`${API_URL}/usuarios/${userId}`);
      if (!res.ok) return;
      const usuario = await res.json();
      setText("userNameDropdown", usuario.nombre || "Usuario");
      setText("userEmail", usuario.email || "");
    } catch (err) {
      console.error("Error al cargar usuario:", err);
    }
  }

  async function cargarHistorial() {
    try {
      mostrarSeccion("loading");
      
      const resViajes = await fetch(`${API_URL}/viajes/usuario/${userId}`);
      todosLosViajes = await resViajes.json();
      
      facturasData = await Promise.all(
        todosLosViajes.map(v => 
          fetch(`${API_URL}/facturas/viaje/${v.id_viaje}`)
            .then(r => r.ok ? r.json() : null)
            .catch(() => null)
        )
      );
      
      viajesFiltrados = [...todosLosViajes];
      
      todosLosViajes.length ? (mostrarSeccion("tabla"), actualizarEstadisticas(), aplicarFiltrosYOrdenamiento()) : mostrarSeccion("empty");
    } catch (err) {
      console.error("Error:", err);
      mostrarSeccion("empty");
    }
  }

  function mostrarSeccion(tipo) {
    const secciones = { loading: "loading-viajes", empty: "empty-viajes", tabla: "tabla-container" };
    Object.entries(secciones).forEach(([key, id]) => key === tipo ? show($(id)) : hide($(id)));
    tipo === "tabla" ? show($("paginacion-container")) : hide($("paginacion-container"));
  }

  // -------- ESTADÍSTICAS --------
  function actualizarEstadisticas() {
    const stats = todosLosViajes.reduce((acc, viaje, idx) => {
      acc.totalViajes++;
      acc.distanciaTotal += viaje.longitud_inicio || 0;
      acc.tiempoTotal += calcularDuracion(viaje.fecha_inicio, viaje.fecha_fin);
      acc.gastoTotal += facturasData[idx]?.subtotal || 0;
      return acc;
    }, { totalViajes: 0, distanciaTotal: 0, tiempoTotal: 0, gastoTotal: 0 });
    
    setText("total-viajes", stats.totalViajes);
    setText("distancia-total", stats.distanciaTotal.toFixed(1));
    setText("tiempo-total", stats.tiempoTotal);
    setText("gasto-total", stats.gastoTotal.toLocaleString());
  }

  // -------- FILTROS Y ORDENAMIENTO --------
  function aplicarFiltrosYOrdenamiento() {
    const busqueda = $("buscar-viaje").value.toLowerCase();
    const [criterio, direccion] = $("ordenar-por").value.split('-');
    
    viajesFiltrados = todosLosViajes.filter(v => 
      !busqueda || v.id_viaje.toString().includes(busqueda) || v.id_bicicleta.toString().includes(busqueda)
    );
    
    viajesFiltrados.sort((a, b) => {
      const idxA = todosLosViajes.indexOf(a), idxB = todosLosViajes.indexOf(b);
      let valorA, valorB;
      
      if (criterio === 'fecha') {
        valorA = new Date(a.fecha_inicio).getTime();
        valorB = new Date(b.fecha_inicio).getTime();
      } else if (criterio === 'duracion') {
        valorA = calcularDuracion(a.fecha_inicio, a.fecha_fin);
        valorB = calcularDuracion(b.fecha_inicio, b.fecha_fin);
      } else if (criterio === 'costo') {
        valorA = facturasData[idxA]?.subtotal || 0;
        valorB = facturasData[idxB]?.subtotal || 0;
      }
      
      return direccion === 'desc' ? valorB - valorA : valorA - valorB;
    });
    
    paginaActual = 1;
    renderizarTabla();
  }

  // -------- RENDERIZADO DE TABLA --------
  function renderizarTabla() {
    const inicio = (paginaActual - 1) * registrosPorPagina;
    const viajesPagina = viajesFiltrados.slice(inicio, inicio + registrosPorPagina);
    
    $("tabla-body").innerHTML = viajesPagina.map(viaje => {
      const idx = todosLosViajes.findIndex(v => v.id_viaje === viaje.id_viaje);
      const factura = facturasData[idx];
      const duracion = calcularDuracion(viaje.fecha_inicio, viaje.fecha_fin);
      const fecha = new Date(viaje.fecha_inicio);
      
      return `
        <tr class="bg-white hover:bg-gray-50 transition cursor-pointer" onclick="window.verDetalleViaje(${viaje.id_viaje})">
          <td class="px-6 py-4 font-medium text-gray-900">#${viaje.id_viaje}</td>
          <td class="px-6 py-4 text-gray-600">
            <div class="text-sm">${fecha.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
            <div class="text-xs text-gray-500">${fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</div>
          </td>
          <td class="px-6 py-4 text-gray-600">Bici #${viaje.id_bicicleta}</td>
          <td class="px-6 py-4 text-gray-600">${duracion} min</td>
          <td class="px-6 py-4 text-gray-600">${(viaje.longitud_inicio || 0).toFixed(1)} km</td>
          <td class="px-6 py-4 font-medium text-gray-900">$${(factura?.subtotal || 0).toLocaleString()}</td>
          <td class="px-6 py-4"><span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Completado</span></td>
          <td class="px-6 py-4 text-center">
            <button onclick="event.stopPropagation(); window.verDetalleViaje(${viaje.id_viaje})" 
                    class="text-[#18C29C] hover:text-[#149E83] font-medium text-sm">Ver detalle</button>
          </td>
        </tr>
      `;
    }).join('');
    
    actualizarPaginacion();
    setText("contador-registros", `${viajesFiltrados.length} viajes`);
  }

  // -------- PAGINACIÓN --------
  function actualizarPaginacion() {
    const totalPaginas = Math.ceil(viajesFiltrados.length / registrosPorPagina);
    const inicio = (paginaActual - 1) * registrosPorPagina + 1;
    const fin = Math.min(paginaActual * registrosPorPagina, viajesFiltrados.length);
    
    setText("pagina-actual", `Página ${paginaActual} de ${totalPaginas}`);
    setText("info-paginacion", `Mostrando ${inicio} a ${fin} de ${viajesFiltrados.length} registros`);
    
    $("btn-primera").disabled = $("btn-anterior").disabled = paginaActual === 1;
    $("btn-siguiente").disabled = $("btn-ultima").disabled = paginaActual === totalPaginas;
  }

  function cambiarPagina(nuevaPagina) {
    const totalPaginas = Math.ceil(viajesFiltrados.length / registrosPorPagina);
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      paginaActual = nuevaPagina;
      renderizarTabla();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // -------- MODAL DETALLE --------
  window.verDetalleViaje = function(idViaje) {
    const viajeIdx = todosLosViajes.findIndex(v => v.id_viaje === idViaje);
    const viaje = todosLosViajes[viajeIdx];
    const factura = facturasData[viajeIdx];
    if (!viaje) return;
    
    const duracion = calcularDuracion(viaje.fecha_inicio, viaje.fecha_fin);
    const fechaInicio = new Date(viaje.fecha_inicio);
    const fechaFin = viaje.fecha_fin ? new Date(viaje.fecha_fin) : null;
    
    $("modal-contenido").innerHTML = `
      <div class="bg-gradient-to-r from-[#18C29C] to-[#149E83] rounded-lg p-4 text-white mb-6">
        <h4 class="text-2xl font-bold mb-1">Viaje #${viaje.id_viaje}</h4>
        <p class="text-sm text-white/90">${fechaInicio.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <h5 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <svg class="w-5 h-5 text-[#18C29C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Información del Viaje
        </h5>
        <div class="grid grid-cols-2 gap-4">
          ${[
            ['Bicicleta', `Bici #${viaje.id_bicicleta}`],
            ['Duración', `${duracion} minutos`],
            ['Distancia', `${(viaje.longitud_inicio || 0).toFixed(2)} km`],
            ['Latitud Inicio', viaje.latitud || 'N/A']
          ].map(([label, value]) => `
            <div><p class="text-xs text-gray-500 mb-1">${label}</p><p class="text-sm font-medium text-gray-800">${value}</p></div>
          `).join('')}
          <div class="col-span-2">
            <p class="text-xs text-gray-500 mb-1">Hora de Inicio</p>
            <p class="text-sm font-medium text-gray-800">${fechaInicio.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          ${fechaFin ? `
            <div class="col-span-2">
              <p class="text-xs text-gray-500 mb-1">Hora de Finalización</p>
              <p class="text-sm font-medium text-gray-800">${fechaFin.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          ` : ''}
        </div>
      </div>

      ${factura ? `
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h5 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-[#18C29C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"/>
            </svg>
            Detalle de Facturación
          </h5>
          <div class="space-y-3">
            ${[
              ['Subtotal', `$${factura.subtotal.toLocaleString()}`],
              ['ID Multa', factura.id_multa || 'Sin multa']
            ].map(([label, value]) => `
              <div class="flex justify-between items-center pb-2 border-b border-gray-200">
                <span class="text-sm text-gray-600">${label}</span>
                <span class="text-sm font-medium text-gray-800">${value}</span>
              </div>
            `).join('')}
            <div class="flex justify-between items-center pt-2">
              <span class="text-base font-semibold text-gray-800">Total</span>
              <span class="text-xl font-bold text-[#18C29C]">$${factura.total.toLocaleString()}</span>
            </div>
            <p class="text-xs text-gray-500 mt-2">Fecha de factura: ${new Date(factura.fecha_fact).toLocaleDateString('es-CO')}</p>
          </div>
        </div>
      ` : `
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p class="text-sm text-yellow-800">No hay información de facturación disponible para este viaje.</p>
        </div>
      `}

      <div class="flex gap-3">
        ${factura ? `
          <button onclick="window.descargarFactura(${viaje.id_viaje})" 
                  class="flex-1 bg-[#18C29C] hover:bg-[#149E83] text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Descargar Factura
          </button>
        ` : ''}
        <button onclick="document.getElementById('cerrar-modal').click()" 
                class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition">Cerrar</button>
      </div>
    `;
    
    show($("modal-detalle"));
  };

  window.descargarFactura = (idViaje) => alert(`Descargando factura del viaje #${idViaje}...`);

  // -------- EVENT LISTENERS --------
  const eventos = {
    "cerrar-modal": () => hide($("modal-detalle")),
    "buscar-viaje": aplicarFiltrosYOrdenamiento,
    "ordenar-por": aplicarFiltrosYOrdenamiento,
    "registros-por-pagina": (e) => {
      registrosPorPagina = parseInt(e.target.value);
      paginaActual = 1;
      renderizarTabla();
    },
    "btn-primera": () => cambiarPagina(1),
    "btn-anterior": () => cambiarPagina(paginaActual - 1),
    "btn-siguiente": () => cambiarPagina(paginaActual + 1),
    "btn-ultima": () => cambiarPagina(Math.ceil(viajesFiltrados.length / registrosPorPagina)),
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
      const eventType = ["buscar-viaje"].includes(id) ? "input" : ["ordenar-por", "registros-por-pagina"].includes(id) ? "change" : "click";
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