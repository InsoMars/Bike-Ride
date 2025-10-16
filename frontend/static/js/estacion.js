document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://127.0.0.1:8080/api";
  const userId = sessionStorage.getItem("userId") || localStorage.getItem("userId");
  
  let estacionesData = [];
  let bicicletasData = [];

  // -------- UTILIDADES --------
  
  const $ = (id) => document.getElementById(id);
  const hide = (el) => el?.classList.add("hidden");
  const show = (el) => el?.classList.remove("hidden");
  const setText = (id, text) => {
    const el = $(id);
    if (el) el.textContent = text;
  };

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

  async function cargarEstaciones() {
    try {
      mostrarSeccion("loading");
      
      [estacionesData, bicicletasData] = await Promise.all([
        fetch(`${API_URL}/estaciones`).then(r => r.json()),
        fetch(`${API_URL}/bicicletas`).then(r => r.json())
      ]);
      
      estacionesData.length ? mostrarSeccion("grid") : mostrarSeccion("empty");
      actualizarEstadisticas();
      renderizarEstaciones(estacionesData);
    } catch (err) {
      console.error("Error:", err);
      mostrarSeccion("empty");
    }
  }

  function mostrarSeccion(tipo) {
    const secciones = { loading: $("loading-estaciones"), empty: $("empty-estaciones"), grid: $("estaciones-grid") };
    Object.entries(secciones).forEach(([key, el]) => key === tipo ? show(el) : hide(el));
  }

  // -------- ESTADÍSTICAS --------
  
  function actualizarEstadisticas() {
    const stats = estacionesData.reduce((acc, est) => {
      const bicis = bicicletasData.filter(b => b.id_estacion === est.id_estacion && b.estado === 'DISPONIBLE');
      acc.total += bicis.length;
      acc.mecanicas += bicis.filter(b => b.id_tipo === 1).length;
      acc.electricas += bicis.filter(b => b.id_tipo === 2).length;
      return acc;
    }, { total: 0, mecanicas: 0, electricas: 0 });
    
    setText("total-estaciones", estacionesData.length);
    setText("total-bicis", stats.total);
    setText("total-mecanicas", stats.mecanicas);
    setText("total-electricas", stats.electricas);
  }

  // -------- RENDERIZADO --------
  
  function getBicisEnEstacion(idEstacion) {
    return bicicletasData.filter(b => b.id_estacion === idEstacion && b.estado === 'DISPONIBLE');
  }

  function renderizarEstaciones(estaciones) {
    $("estaciones-grid").innerHTML = estaciones.map(crearTarjetaEstacion).join('');
  }

  function crearTarjetaEstacion(estacion) {
    const bicis = getBicisEnEstacion(estacion.id_estacion);
    const mecanicas = bicis.filter(b => b.id_tipo === 1).length;
    const electricas = bicis.filter(b => b.id_tipo === 2).length;
    const porcentaje = estacion.capacidad > 0 ? Math.round((bicis.length / estacion.capacidad) * 100) : 0;
    const color = porcentaje >= 50 ? 'green' : porcentaje >= 20 ? 'yellow' : 'red';
    
    return `
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
           onclick="window.abrirDetalleEstacion(${estacion.id_estacion})">
        
        <div class="bg-gradient-to-r from-[#18C29C] to-[#149E83] p-4 text-white">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-bold mb-1">${estacion.nombre}</h3>
              <p class="text-sm text-white/90 flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                </svg>
                ${estacion.direccion || 'Sin dirección'}
              </p>
            </div>
            <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="p-4 space-y-4">
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-600">Disponibilidad</span>
              <span class="text-sm font-bold text-${color}-600">${porcentaje}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div class="bg-${color}-500 h-2.5 rounded-full transition-all" style="width: ${porcentaje}%"></div>
            </div>
            <p class="text-xs text-gray-500 mt-1">${bicis.length} de ${estacion.capacidad} espacios disponibles</p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            ${crearBadgeBici('blue', 'Mecánicas', mecanicas)}
            ${crearBadgeBici('yellow', 'Eléctricas', electricas)}
          </div>

          <div class="pt-3 border-t border-gray-100">
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>📍 ${estacion.coordenadas || 'Sin coordenadas'}</span>
              <button class="text-[#18C29C] hover:text-[#149E83] font-medium">Ver detalles →</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function crearBadgeBici(color, tipo, cantidad) {
    const icon = color === 'blue' 
      ? 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
      : 'M13 10V3L4 14h7v7l9-11h-7z';
    
    return `
      <div class="bg-${color}-50 rounded-lg p-3 text-center">
        <div class="flex items-center justify-center gap-1 mb-1">
          <svg class="w-4 h-4 text-${color}-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${icon}"/>
          </svg>
          <span class="text-xs font-medium text-gray-600">${tipo}</span>
        </div>
        <p class="text-2xl font-bold text-${color}-600">${cantidad}</p>
      </div>
    `;
  }

  // -------- MODAL DETALLE --------
  
  window.abrirDetalleEstacion = function(idEstacion) {
    const estacion = estacionesData.find(e => e.id_estacion === idEstacion);
    if (!estacion) return;
    
    const bicis = getBicisEnEstacion(idEstacion);
    const mecanicas = bicis.filter(b => b.id_tipo === 1);
    const electricas = bicis.filter(b => b.id_tipo === 2);
    
    setText("modal-titulo", estacion.nombre);
    setText("modal-direccion", estacion.direccion || 'No disponible');
    setText("modal-capacidad", `${estacion.capacidad} espacios`);
    setText("modal-coordenadas", estacion.coordenadas || 'No disponible');
    setText("modal-disponibilidad", `${bicis.length} bicicletas disponibles`);
    
    const sinBicis = $("modal-sin-bicis");
    const listaBicis = $("modal-lista-bicis");
    
    if (!bicis.length) {
      show(sinBicis);
      hide(listaBicis);
    } else {
      hide(sinBicis);
      show(listaBicis);
      
      actualizarTipoBicis("mecanicas", mecanicas);
      actualizarTipoBicis("electricas", electricas);
    }
    
    show($("modal-detalle"));
  };

  function actualizarTipoBicis(tipo, bicis) {
    const container = $(`modal-${tipo}-container`);
    const grid = $(`modal-grid-${tipo}`);
    const color = tipo === 'mecanicas' ? 'blue' : 'yellow';
    
    if (!bicis.length) {
      hide(container);
      return;
    }
    
    show(container);
    setText(`modal-count-${tipo}`, bicis.length);
    grid.innerHTML = bicis.map(b => `
      <div class="bg-${color}-50 border border-${color}-200 rounded-lg p-2 text-center">
        <p class="text-xs font-medium text-${color}-800">Bici #${b.id_bicicleta}</p>
        <p class="text-xs text-${color}-600 mt-0.5">${b.nombre_serie || 'N/A'}</p>
      </div>
    `).join('');
  }

  function cerrarModal() {
    hide($("modal-detalle"));
  }

  // -------- FILTROS --------
  
  function filtrarEstaciones() {
    const busqueda = $("buscar-estacion").value.toLowerCase();
    const tipoBici = $("filtro-tipo-bici").value;
    const ordenarPor = $("ordenar-por").value;
    
    let filtradas = estacionesData.filter(est => {
      const coincideBusqueda = !busqueda || 
        est.nombre.toLowerCase().includes(busqueda) ||
        est.direccion?.toLowerCase().includes(busqueda);
      
      if (!coincideBusqueda) return false;
      
      if (tipoBici) {
        const bicis = getBicisEnEstacion(est.id_estacion);
        const tipoId = tipoBici === 'MECANICA' ? 1 : 2;
        return bicis.some(b => b.id_tipo === tipoId);
      }
      
      return true;
    });
    
    const ordenFns = {
      nombre: (a, b) => a.nombre.localeCompare(b.nombre),
      capacidad: (a, b) => b.capacidad - a.capacidad,
      disponibles: (a, b) => getBicisEnEstacion(b.id_estacion).length - getBicisEnEstacion(a.id_estacion).length
    };
    
    filtradas.sort(ordenFns[ordenarPor]);
    
    filtradas.length ? mostrarSeccion("grid") : mostrarSeccion("empty");
    renderizarEstaciones(filtradas);
  }

  // -------- EVENT LISTENERS --------
  
  const eventos = {
    "cerrar-modal": cerrarModal,
    "buscar-estacion": filtrarEstaciones,
    "filtro-tipo-bici": filtrarEstaciones,
    "ordenar-por": filtrarEstaciones,
    "logoutBtn": (e) => {
      e.preventDefault();
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "index.html";
    }
  };

  Object.entries(eventos).forEach(([id, handler]) => {
    $(id)?.addEventListener(id.includes("buscar") ? "input" : "click", handler);
  });
  
  $("modal-detalle")?.addEventListener("click", (e) => {
    if (e.target === $("modal-detalle")) cerrarModal();
  });
  
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("modal-detalle")?.classList.contains("hidden")) {
      cerrarModal();
    }
  });

  // -------- INICIALIZAR --------
  (async () => {
    await cargarDatosUsuario();
    await cargarEstaciones();
  })();
});