document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://127.0.0.1:8080/api";
  const userId = sessionStorage.getItem("userId") || localStorage.getItem("userId");

  let mediosPagoData = [];

  // -------- ELEMENTOS DEL DOM --------
  const saldoPrincipal = document.getElementById("saldo-principal");
  const loadingMedios = document.getElementById("loading-medios");
  const emptyMedios = document.getElementById("empty-medios");
  const listaMedios = document.getElementById("lista-medios");
  const btnAgregarMedio = document.getElementById("btn-agregar-medio");
  const btnRecargar = document.getElementById("btn-recargar");
  const btnHistorial = document.getElementById("btn-historial");

  // -------- CARGA DE DATOS --------
  
  async function cargarDatosUsuario() {
    try {
      const res = await fetch(`${API_URL}/usuarios/${userId}`);
      if (!res.ok) return;
      
      const usuario = await res.json();
      document.getElementById("userNameDropdown").textContent = usuario.nombre || "Usuario";
      document.getElementById("userEmail").textContent = usuario.email || "";
      
      // Cargar saldo
      saldoPrincipal.textContent = `$${usuario.saldo?.toLocaleString('es-CO') || '0'}`;
    } catch (err) {
      console.error("Error al cargar usuario:", err);
    }
  }

  async function cargarMediosPago() {
    try {
      loadingMedios.classList.remove("hidden");
      emptyMedios.classList.add("hidden");
      listaMedios.classList.add("hidden");
      
      const res = await fetch(`${API_URL}/metodos-pago/usuario/${userId}`);
      if (!res.ok) throw new Error("Error al cargar medios de pago");
      
      mediosPagoData = await res.json();
      
      loadingMedios.classList.add("hidden");
      
      if (mediosPagoData.length === 0) {
        emptyMedios.classList.remove("hidden");
      } else {
        listaMedios.classList.remove("hidden");
        renderizarMediosPago();
      }
    } catch (err) {
      console.error("Error al cargar medios de pago:", err);
      loadingMedios.classList.add("hidden");
      emptyMedios.classList.remove("hidden");
    }
  }

  // -------- RENDERIZADO --------
  
  function renderizarMediosPago() {
    listaMedios.innerHTML = mediosPagoData.map(medio => crearTarjetaMedio(medio)).join('');
  }

  function crearTarjetaMedio(medio) {
    const tipoIcono = obtenerIconoTarjeta(medio.tipo_tarjeta);
    const ultimosDigitos = medio.numero_tarjeta?.slice(-4) || '****';
    
    return `
      <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
        <div class="flex items-center gap-4">
          ${tipoIcono}
          <div>
            <p class="font-semibold text-gray-900">${medio.tipo_tarjeta || 'Tarjeta'}</p>
            <p class="text-sm text-gray-500">•••• ${ultimosDigitos}</p>
          </div>
        </div>
        <button onclick="window.eliminarMedioPago(${medio.id_metodo_pago})" 
          class="text-red-600 hover:text-red-800 transition p-2" title="Eliminar">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    `;
  }

  function obtenerIconoTarjeta(tipo) {
    const iconos = {
      'VISA': '<div class="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>',
      'MASTERCARD': '<div class="w-12 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>'
    };
    return iconos[tipo?.toUpperCase()] || '<div class="w-12 h-8 bg-gray-400 rounded flex items-center justify-center text-white text-xs font-bold">💳</div>';
  }

  // -------- MODAL AGREGAR MEDIO DE PAGO --------
  
  function abrirModalAgregarMedio() {
    const modal = document.getElementById("modal-agregar-medio");
    modal?.classList.remove("hidden");
    document.getElementById("form-medio-pago")?.reset();
    document.getElementById("error-medio")?.classList.add("hidden");
  }

  function cerrarModalMedio() {
    document.getElementById("modal-agregar-medio")?.classList.add("hidden");
  }

  function mostrarErrorMedio(mensaje) {
    const errorDiv = document.getElementById("error-medio");
    const errorTexto = document.getElementById("error-medio-texto");
    if (errorTexto) errorTexto.textContent = mensaje;
    errorDiv?.classList.remove("hidden");
    errorDiv?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function mostrarExitoMedio(mensaje) {
    const exitoDiv = document.getElementById("exito-medio");
    const exitoTexto = document.getElementById("exito-medio-texto");
    if (exitoTexto) exitoTexto.textContent = mensaje;
    exitoDiv?.classList.remove("hidden");
    setTimeout(() => exitoDiv?.classList.add("hidden"), 3000);
  }

  // -------- VALIDACIÓN BIN --------
  
  function detectarTipoTarjeta(numero) {
    const bin = numero.replace(/\s/g, '').substring(0, 6);
    
    // Validación de BINs conocidos (solo VISA y MASTERCARD)
    if (/^4/.test(bin)) return 'VISA';
    if (/^5[1-5]/.test(bin)) return 'MASTERCARD';
    
    return null;
  }

  function validarNumeroTarjeta(numero) {
    const soloNumeros = numero.replace(/\s/g, '');
    
    // Validar longitud
    if (soloNumeros.length < 13 || soloNumeros.length > 19) {
      return false;
    }
    
    // Algoritmo de Luhn
    let suma = 0;
    let alternar = false;
    
    for (let i = soloNumeros.length - 1; i >= 0; i--) {
      let digito = parseInt(soloNumeros[i]);
      
      if (alternar) {
        digito *= 2;
        if (digito > 9) digito -= 9;
      }
      
      suma += digito;
      alternar = !alternar;
    }
    
    return suma % 10 === 0;
  }

  // Formatear número de tarjeta mientras se escribe
  function formatearNumeroTarjeta(e) {
    let valor = e.target.value.replace(/\s/g, '');
    let valorFormateado = valor.match(/.{1,4}/g)?.join(' ') || valor;
    e.target.value = valorFormateado;
    
    // Detectar tipo de tarjeta
    const tipo = detectarTipoTarjeta(valor);
    const iconoTipo = document.getElementById("icono-tipo-tarjeta");
    
    if (tipo && iconoTipo) {
      iconoTipo.innerHTML = `<span class="text-sm font-semibold text-green-600">${tipo}</span>`;
    } else if (iconoTipo) {
      iconoTipo.innerHTML = '';
    }
  }

  // -------- AGREGAR MEDIO DE PAGO --------
  
  async function agregarMedioPago(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const numeroTarjeta = formData.get('numero_tarjeta').replace(/\s/g, '');
    const nombreTitular = formData.get('nombre_titular');
    const fechaVencimiento = formData.get('fecha_vencimiento');
    const cvv = formData.get('cvv');
    
    // Validaciones básicas
    if (!validarNumeroTarjeta(numeroTarjeta)) {
      mostrarErrorMedio("El número de tarjeta no es válido");
      return;
    }
    
    const tipoTarjeta = detectarTipoTarjeta(numeroTarjeta);
    if (!tipoTarjeta) {
      mostrarErrorMedio("La tarjeta no existe o no es válida. Verifica el BIN.");
      return;
    }
    
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreTitular)) {
      mostrarErrorMedio("El nombre del titular solo puede contener letras");
      return;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(fechaVencimiento)) {
      mostrarErrorMedio("Formato de fecha inválido (MM/YY)");
      return;
    }
    
    if (!/^\d{3,4}$/.test(cvv)) {
      mostrarErrorMedio("CVV inválido");
      return;
    }
    
    const submitBtn = document.getElementById("submit-medio-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Procesando...";
    
    try {
      // Estructura según el diagrama ER
      const ultimosDigitos = numeroTarjeta.slice(-4);
      const data = {
        id_usuario: parseInt(userId),
        tipo: "TARJETA",
        detalle_metodo: `${tipoTarjeta} **** ${ultimosDigitos} - ${nombreTitular.toUpperCase()}`,
        token: numeroTarjeta, // El backend debe encriptar esto
        tipo_tarjeta: tipoTarjeta // Para validación BIN
      };
      
      const res = await fetch(`${API_URL}/metodos-pago`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      const result = await res.json();
      
      if (res.ok) {
        mostrarExitoMedio("✓ Medio de pago registrado exitosamente. BIN verificado correctamente.");
        cerrarModalMedio();
        await cargarMediosPago();
      } else {
        mostrarErrorMedio(result.detail || "Error al registrar el medio de pago");
      }
    } catch (err) {
      console.error("Error:", err);
      mostrarErrorMedio("Error de conexión con el servidor");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Agregar Tarjeta";
    }
  }

  // -------- ELIMINAR MEDIO DE PAGO --------
  
  window.eliminarMedioPago = async function(idMetodo) {
    if (!confirm("¿Estás seguro de eliminar este medio de pago?")) return;
    
    try {
      const res = await fetch(`${API_URL}/metodos-pago/${idMetodo}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
      
      const result = await res.json();
      
      if (res.ok) {
        alert("Medio de pago eliminado exitosamente");
        await cargarMediosPago();
      } else {
        alert(result.detail || "Error al eliminar el medio de pago");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error de conexión con el servidor");
    }
  };

  // -------- EVENT LISTENERS --------
  
  btnAgregarMedio?.addEventListener("click", abrirModalAgregarMedio);
  document.getElementById("btn-cerrar-medio")?.addEventListener("click", cerrarModalMedio);
  document.getElementById("btn-cancelar-medio")?.addEventListener("click", cerrarModalMedio);
  
  document.getElementById("modal-agregar-medio")?.addEventListener("click", (e) => {
    if (e.target.id === "modal-agregar-medio") cerrarModalMedio();
  });
  
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarModalMedio();
  });
  
  document.getElementById("form-medio-pago")?.addEventListener("submit", agregarMedioPago);
  
  document.getElementById("numero_tarjeta")?.addEventListener("input", formatearNumeroTarjeta);
  
  btnHistorial?.addEventListener("click", () => window.location.href = "user-historial.html");
  btnRecargar?.addEventListener("click", () => alert("Funcionalidad de recarga próximamente"));
  
  document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "index.html";
  });

  // -------- INICIALIZAR --------
  (async function() {
    await cargarDatosUsuario();
    await cargarMediosPago();
  })();
});