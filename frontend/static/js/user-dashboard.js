document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = "http://127.0.0.1:8080/api";
  
  // Obtener ID del usuario desde 
  const userId = sessionStorage.getItem("userId") || localStorage.getItem("userId");
  
  if (!userId) {
    // Si no hay usuario logueado, redirigir al login
    window.location.href = "index.html";
    return;
  }

  // Constantes para cálculo de costos
  const COSTOS = {
    ULTIMA_MILLA: {
      base: 17500,
      tiempoMaximo: 45, // minutos
      costoAdicional: 250 // por minuto
    },
    RECORRIDO_LARGO: {
      base: 25000,
      tiempoMaximo: 75, // minutos
      costoAdicional: 1000 // por minuto
    }
  };

  // -------- CARGAR DATOS DEL USUARIO --------
  async function cargarDatosUsuario() {
    try {
      const res = await fetch(`${API_URL}/usuarios/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      
      if (res.ok) {
        const usuario = await res.json();
        
        // Actualizar nombre en el dropdown
        const userNameDropdown = document.getElementById("userNameDropdown");
        const userEmail = document.getElementById("userEmail");
        
        if (userNameDropdown) {
          userNameDropdown.textContent = usuario.nombre || "Usuario";
        }
        if (userEmail) {
          userEmail.textContent = usuario.email || "";
        }
        
      } else {
        console.error("Error al cargar datos del usuario");
      }
    } catch (err) {
      console.error("Error de conexión:", err);
    }
  }

  // -------- CARGAR SALDO --------
  async function cargarSaldo() {
    try {
      const res = await fetch(`${API_URL}/usuarios/${userId}/saldo`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      
      if (res.ok) {
        const data = await res.json();
        const saldoElement = document.getElementById("saldo");
        if (saldoElement) {
          saldoElement.textContent = `$${data.saldo.toLocaleString('es-CO')}`;
        }
      }
    } catch (err) {
      console.error("Error al cargar saldo:", err);
      const saldoElement = document.getElementById("saldo");
      if (saldoElement) {
        saldoElement.textContent = "$0";
      }
    }
  }

  // -------- CARGAR VIAJES TOTALES --------
  async function cargarViajesHistorial() {
    try {
      const res = await fetch(`${API_URL}/viajes/usuario/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      
      if (res.ok) {
        const viajes = await res.json();
        const viajesElement = document.getElementById("viajes");
        if (viajesElement) {
          viajesElement.textContent = viajes.length || 0;
        }
      }
    } catch (err) {
      console.error("Error al cargar viajes:", err);
      const viajesElement = document.getElementById("viajes");
      if (viajesElement) {
        viajesElement.textContent = "0";
      }
    }
  }

  // -------- CARGAR PUNTOS --------
  async function cargarPuntos() {
    try {
      const res = await fetch(`${API_URL}/usuarios/${userId}/puntos`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      
      if (res.ok) {
        const data = await res.json();
        const puntosElement = document.getElementById("puntos");
        if (puntosElement) {
          puntosElement.textContent = data.puntos.toLocaleString('es-CO') || "0";
        }
      }
    } catch (err) {
      console.error("Error al cargar puntos:", err);
      const puntosElement = document.getElementById("puntos");
      if (puntosElement) {
        puntosElement.textContent = "0";
      }
    }
  }

  // -------- CALCULAR COSTO DEL VIAJE --------
  function calcularCosto(tipoRecorrido, minutosTranscurridos) {
    const config = tipoRecorrido === "ULTIMA_MILLA" ? COSTOS.ULTIMA_MILLA : COSTOS.RECORRIDO_LARGO;
    
    let costoTotal = config.base;
    
    // Si excede el tiempo máximo, agregar costo adicional
    if (minutosTranscurridos > config.tiempoMaximo) {
      const minutosExtra = minutosTranscurridos - config.tiempoMaximo;
      costoTotal += minutosExtra * config.costoAdicional;
    }
    
    return {
      costoTotal,
      tiempoMaximo: config.tiempoMaximo,
      minutosExtra: Math.max(0, minutosTranscurridos - config.tiempoMaximo),
      costoBase: config.base
    };
  }

  // -------- CARGAR VIAJE ACTIVO --------
  async function cargarViajeActivo() {
    try {
      const res = await fetch(`${API_URL}/viajes/activo/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      
      if (res.ok) {
        const viajeActivo = await res.json();
        
        if (viajeActivo && viajeActivo.id_viaje) {
          mostrarViajeActivo(viajeActivo);
        } else {
          mostrarSinViajeActivo();
        }
      } else {
        mostrarSinViajeActivo();
      }
    } catch (err) {
      console.error("Error al cargar viaje activo:", err);
      mostrarSinViajeActivo();
    }
  }

  function mostrarViajeActivo(viaje) {
    // Determinar tipo de recorrido
    const tipoRecorrido = viaje.tipo_recorrido || "RECORRIDO_LARGO";
    const config = tipoRecorrido === "ULTIMA_MILLA" ? COSTOS.ULTIMA_MILLA : COSTOS.RECORRIDO_LARGO;
    
    // Actualizar estado
    const estadoViaje = document.getElementById("estado-viaje");
    if (estadoViaje) {
      estadoViaje.innerHTML = `
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="5"></circle>
        </svg>
        En curso
      `;
      estadoViaje.className = "px-2 sm:px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1";
    }
    
    // Actualizar modelo de bicicleta
    const bicicletaElement = document.getElementById("viaje-bicicleta");
    if (bicicletaElement) {
      const modeloBici = viaje.bicicleta?.modelo || viaje.modelo_bicicleta || `Bici #${viaje.id_bicicleta || '---'}`;
      bicicletaElement.textContent = modeloBici;
    }
    
    // Calcular tiempo transcurrido
    if (viaje.hora_inicio) {
      const horaInicio = new Date(viaje.hora_inicio);
      const ahora = new Date();
      const minutosTranscurridos = Math.floor((ahora - horaInicio) / 60000);
      const horas = Math.floor(minutosTranscurridos / 60);
      const mins = minutosTranscurridos % 60;
      
      // Mostrar tiempo con indicador de exceso
      const tiempoElement = document.getElementById("viaje-tiempo");
      if (tiempoElement) {
        const tiempoTexto = `${horas}h ${mins}min`;
        
        if (minutosTranscurridos > config.tiempoMaximo) {
          const minutosExtra = minutosTranscurridos - config.tiempoMaximo;
          tiempoElement.innerHTML = `${tiempoTexto} <span class="text-red-600 text-xs">(+${minutosExtra} min)</span>`;
        } else {
          const minutosRestantes = config.tiempoMaximo - minutosTranscurridos;
          tiempoElement.innerHTML = `${tiempoTexto} <span class="text-gray-500 text-xs">(${minutosRestantes} min rest.)</span>`;
        }
      }
      
      // Calcular y mostrar costo estimado
      const { costoTotal, minutosExtra } = calcularCosto(tipoRecorrido, minutosTranscurridos);
      
      const costoElement = document.getElementById("viaje-costo");
      if (costoElement) {
        if (minutosExtra > 0) {
          costoElement.innerHTML = `
            <span>$${costoTotal.toLocaleString('es-CO')}</span>
            <span class="text-xs text-red-600 block">+$${(minutosExtra * config.costoAdicional).toLocaleString('es-CO')} extra</span>
          `;
        } else {
          costoElement.textContent = `$${costoTotal.toLocaleString('es-CO')}`;
        }
      }
    }
    
    // Actualizar tipo de recorrido con descripción
    const tipoElement = document.getElementById("viaje-tipo");
    if (tipoElement) {
      const tipoTexto = tipoRecorrido === "ULTIMA_MILLA" 
        ? "Última Milla (45 min)" 
        : "Recorrido Largo (75 min)";
      tipoElement.textContent = tipoTexto;
    }
    
  }

  function mostrarSinViajeActivo() {
    // Actualizar estado
    const estadoViaje = document.getElementById("estado-viaje");
    if (estadoViaje) {
      estadoViaje.textContent = "Sin viaje activo";
      estadoViaje.className = "px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full flex items-center gap-1";
    }
    
    // Resetear valores
    const bicicletaElement = document.getElementById("viaje-bicicleta");
    const tiempoElement = document.getElementById("viaje-tiempo");
    const tipoElement = document.getElementById("viaje-tipo");
    const costoElement = document.getElementById("viaje-costo");
    
    if (bicicletaElement) bicicletaElement.textContent = "—";
    if (tiempoElement) tiempoElement.innerHTML = "—";
    if (tipoElement) tipoElement.textContent = "—";
    if (costoElement) costoElement.innerHTML = "—";
  }

  // -------- CARGAR ESTADÍSTICAS DEL MES --------
  async function cargarEstadisticasMes() {
    try {
      const res = await fetch(`${API_URL}/viajes/estadisticas/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      
      if (res.ok) {
        const estadisticas = await res.json();
        
        // Actualizar viajes del mes
        const viajesMesElement = document.getElementById("viajes-mes");
        if (viajesMesElement && estadisticas.viajes_mes !== undefined) {
          viajesMesElement.textContent = estadisticas.viajes_mes;
        } else if (viajesMesElement) {
          viajesMesElement.textContent = "0";
        }
        
        // Actualizar tiempo total
        const tiempoTotalElement = document.getElementById("tiempo-total");
        if (tiempoTotalElement && estadisticas.tiempo_total) {
          tiempoTotalElement.textContent = estadisticas.tiempo_total;
        } else if (tiempoTotalElement) {
          tiempoTotalElement.textContent = "0h 0min";
        }
      }
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
      const viajesMesElement = document.getElementById("viajes-mes");
      const tiempoTotalElement = document.getElementById("tiempo-total");
      
      if (viajesMesElement) viajesMesElement.textContent = "0";
      if (tiempoTotalElement) tiempoTotalElement.textContent = "0h 0min";
    }
  }

  // -------- BOTÓN CERRAR SESIÓN --------
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      
      // Limpiar datos de sesión
      sessionStorage.removeItem("userId");
      localStorage.removeItem("userId");
      
      // Redirigir al login
      window.location.href = "index.html";
    });
  }
 
  // -------- CARGAR TODOS LOS DATOS AL INICIO --------
  await cargarDatosUsuario();
  await cargarSaldo();
  await cargarViajesHistorial();
  await cargarPuntos();
  await cargarViajeActivo();
  await cargarEstadisticasMes();

  // -------- ACTUALIZAR DATOS CADA 30 SEGUNDOS --------
  setInterval(async () => {
    await cargarViajeActivo();
    await cargarSaldo();
  }, 30000);
});