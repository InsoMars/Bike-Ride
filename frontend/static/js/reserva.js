document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://127.0.0.1:8080/api";
  const userId = sessionStorage.getItem("userId") || localStorage.getItem("userId");
  
  // Variables globales
  let reservasData = [];
  let estacionesData = [];

  // -------- ELEMENTOS DEL DOM --------
  const modal = document.getElementById("modal-reserva");
  const formReserva = document.getElementById("form-reserva");
  const tablaReservas = document.getElementById("tabla-reservas");
  const errorMensaje = document.getElementById("error-mensaje");
  const errorTexto = document.getElementById("error-texto");

  // -------- CARGA DE DATOS --------
  
  async function cargarDatosUsuario() {
    try {
      const res = await fetch(`${API_URL}/usuarios/${userId}`);
      if (!res.ok) return;
      
      const usuario = await res.json();
      document.getElementById("userNameDropdown").textContent = usuario.nombre || "Usuario";
      document.getElementById("userEmail").textContent = usuario.email || "";
    } catch (err) {
      console.error("Error al cargar usuario:", err);
    }
  }

  async function cargarEstaciones() {
    try {
      const res = await fetch(`${API_URL}/estaciones`);
      if (!res.ok) throw new Error("Error al cargar estaciones");
      
      estacionesData = await res.json();
      
      const options = estacionesData.map(e => 
        `<option value="${e.id_estacion}">${e.nombre}</option>`
      ).join('');
      
      document.getElementById("estacion-salida").innerHTML = 
        '<option value="">Selecciona una estación</option>' + options;
      document.getElementById("estacion-llegada").innerHTML = 
        '<option value="">Selecciona una estación</option>' + options;
        
    } catch (err) {
      console.error("Error al cargar estaciones:", err);
      mostrarError("No se pudieron cargar las estaciones");
    }
  }

  async function cargarReservas() {
    try {
      mostrarSeccion("loading");
      
      const res = await fetch(`${API_URL}/reservas/usuario/${userId}`);
      if (!res.ok) throw new Error("Error al cargar reservas");
      
      reservasData = await res.json();
      
      if (reservasData.length === 0) {
        mostrarSeccion("empty");
      } else {
        mostrarSeccion("tabla");
        renderizarReservas(reservasData);
      }
    } catch (err) {
      console.error("Error al cargar reservas:", err);
      mostrarSeccion("empty");
    }
  }

  function mostrarSeccion(tipo) {
    document.getElementById("loading-reservas").classList.toggle("hidden", tipo !== "loading");
    document.getElementById("empty-reservas").classList.toggle("hidden", tipo !== "empty");
    document.getElementById("reservas-container").classList.toggle("hidden", tipo !== "tabla");
  }

  // -------- RENDERIZADO --------
  
  function renderizarReservas(reservas) {
    tablaReservas.innerHTML = reservas.map(r => crearFilaReserva(r)).join('');
  }

  function crearFilaReserva(reserva) {
    const fecha = new Date(reserva.fecha);
    const estInicio = estacionesData.find(e => e.id_estacion === reserva.id_estacion_inicio);
    const estFinal = estacionesData.find(e => e.id_estacion === reserva.id_estacion_final);
    
    const estado = obtenerEstado(reserva);
    const acciones = obtenerAcciones(reserva);
    
    return `
      <tr class="hover:bg-gray-50 transition">
        <td class="px-4 sm:px-6 py-4 font-medium text-gray-900">#${reserva.id_reserva}</td>
        <td class="px-4 sm:px-6 py-4">
          <div class="text-sm font-medium text-gray-900">${fecha.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
          <div class="text-xs text-gray-500">${fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</div>
        </td>
        <td class="px-4 sm:px-6 py-4 text-gray-700">${estInicio?.nombre || 'N/A'}</td>
        <td class="px-4 sm:px-6 py-4 text-gray-700">${estFinal?.nombre || 'N/A'}</td>
        <td class="px-4 sm:px-6 py-4 text-center text-xs text-gray-600">${reserva.tipo_viaje || 'N/A'}</td>
        <td class="px-4 sm:px-6 py-4 text-center">
          <span class="px-2 py-1 bg-${reserva.tipo_bicicleta === 'ELECTRICA' ? 'yellow' : 'blue'}-100 text-${reserva.tipo_bicicleta === 'ELECTRICA' ? 'yellow' : 'blue'}-800 text-xs font-semibold rounded-full">
            ${reserva.tipo_bicicleta === 'ELECTRICA' ? '⚡ Eléctrica' : '🔧 Mecánica'}
          </span>
        </td>
        <td class="px-4 sm:px-6 py-4 text-center">${estado}</td>
        <td class="px-4 sm:px-6 py-4 text-center">${acciones}</td>
      </tr>
    `;
  }

  function obtenerEstado(reserva) {
    if (reserva.activa) return '<span class="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Activa</span>';
    if (reserva.viaje_completado) return '<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">Completada</span>';
    if (reserva.cancelada) return '<span class="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">Cancelada</span>';
    return '<span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">Pendiente</span>';
  }

  function obtenerAcciones(reserva) {
    if (reserva.activa) {
      return `<button onclick="window.verViajeActivo(${reserva.id_reserva})" class="text-blue-600 hover:text-blue-800 text-xs font-medium">Ver viaje</button>`;
    }
    if (reserva.viaje_completado) {
      return `<button onclick="window.verFactura(${reserva.id_reserva})" class="text-green-600 hover:text-green-800 text-xs font-medium">Ver factura</button>`;
    }
    if (!reserva.cancelada && !reserva.activa) {
      return `<button onclick="window.cancelarReservaGlobal(${reserva.id_reserva})" class="text-red-600 hover:text-red-800"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>`;
    }
    return '<span class="text-gray-400 text-xs">—</span>';
  }

  // -------- FILTROS --------
  
  function filtrarReservas() {
    const estado = document.getElementById("filtro-estado").value;
    const tipo = document.getElementById("filtro-tipo").value;
    const busqueda = document.getElementById("buscar-reserva").value.toLowerCase();
    
    const filtradas = reservasData.filter(r => {
      const cumpleEstado = !estado || 
        (estado === "ACTIVA" && r.activa) ||
        (estado === "COMPLETADA" && r.viaje_completado) ||
        (estado === "CANCELADA" && r.cancelada) ||
        (estado === "PENDIENTE" && !r.activa && !r.viaje_completado && !r.cancelada);
      
      const cumpleTipo = !tipo || r.tipo_bicicleta === tipo;
      
      const estInicio = estacionesData.find(e => e.id_estacion === r.id_estacion_inicio);
      const estFinal = estacionesData.find(e => e.id_estacion === r.id_estacion_final);
      const cumpleBusqueda = !busqueda || 
        estInicio?.nombre.toLowerCase().includes(busqueda) ||
        estFinal?.nombre.toLowerCase().includes(busqueda);
      
      return cumpleEstado && cumpleTipo && cumpleBusqueda;
    });
    
    renderizarReservas(filtradas);
  }

  // -------- MODAL --------
  
  function abrirModal() {
    // Verificar reserva activa 
    if (reservasData.some(r => r.activa)) {
      alert("Ya tienes una reserva activa. No puedes crear otra hasta que completes o canceles la actual.");
      return;
    }
    
    modal.classList.remove("hidden");
    errorMensaje.classList.add("hidden");
    formReserva.reset();
    
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById("fecha-reserva").min = hoy;
    document.getElementById("fecha-reserva").value = hoy;
  }

  function cerrarModal() {
    modal.classList.add("hidden");
    formReserva.reset();
    errorMensaje.classList.add("hidden");
  }

  function mostrarError(mensaje) {
    errorTexto.textContent = mensaje;
    errorMensaje.classList.remove("hidden");
    errorMensaje.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // -------- CREAR RESERVA --------
  
  async function crearReserva(e) {
    e.preventDefault();
    
    const formData = new FormData(formReserva);
    const data = {
      id_usuario: parseInt(userId),
      id_estacion_inicio: parseInt(formData.get('estacion-salida')),
      id_estacion_final: parseInt(formData.get('estacion-llegada')),
      fecha: `${formData.get('fecha')}T${formData.get('hora')}:00`,
      tipo_bicicleta: formData.get('tipo-bici')
    };
    
    // Validación básica 
    if (data.id_estacion_inicio === data.id_estacion_final) {
      mostrarError("La estación de salida y llegada deben ser diferentes");
      return;
    }
    
    const submitBtn = document.getElementById("submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Creando...";
    
    try {
      const res = await fetch(`${API_URL}/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      const result = await res.json();
      
      if (res.ok) {
        alert("¡Reserva creada exitosamente!");
        cerrarModal();
        await cargarReservas();
      } else {
        mostrarError(result.detail || "Error al crear la reserva");
      }
    } catch (err) {
      console.error("Error:", err);
      mostrarError("Error de conexión con el servidor");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Confirmar Reserva";
    }
  }

  // -------- ACCIONES GLOBALES --------
  
  window.cancelarReservaGlobal = async function(idReserva) {
    if (!confirm("¿Estás seguro de que deseas cancelar esta reserva?")) return;
    
    try {
      const res = await fetch(`${API_URL}/reservas/${idReserva}/cancelar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });
      
      const result = await res.json();
      
      if (res.ok) {
        alert("Reserva cancelada exitosamente");
        await cargarReservas();
      } else {
        alert(result.detail || "Error al cancelar la reserva");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error de conexión con el servidor");
    }
  };

  window.verViajeActivo = (id) => window.location.href = `user-viaje.html?reserva=${id}`;
  window.verFactura = (id) => window.location.href = `user-factura.html?reserva=${id}`;

  // -------- EVENT LISTENERS --------
  
  document.getElementById("btn-nueva-reserva")?.addEventListener("click", abrirModal);
  document.getElementById("btn-crear-primera")?.addEventListener("click", abrirModal);
  document.getElementById("cerrar-modal")?.addEventListener("click", cerrarModal);
  document.getElementById("cancelar-modal")?.addEventListener("click", cerrarModal);
  document.getElementById("filtro-estado")?.addEventListener("change", filtrarReservas);
  document.getElementById("filtro-tipo")?.addEventListener("change", filtrarReservas);
  document.getElementById("buscar-reserva")?.addEventListener("input", filtrarReservas);
  
  modal?.addEventListener("click", (e) => e.target === modal && cerrarModal());
  document.addEventListener("keydown", (e) => e.key === "Escape" && !modal.classList.contains("hidden") && cerrarModal());
  
  formReserva?.addEventListener("submit", crearReserva);
  
  document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "index.html";
  });

  // -------- INICIALIZAR --------
  (async function() {
    await cargarDatosUsuario();
    await cargarEstaciones();
    await cargarReservas();
  })();
});