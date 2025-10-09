const API_BASE = "http://localhost:8080/api";
const USER_ID = localStorage.getItem("userId");
const TOKEN = localStorage.getItem("token");

// Función para peticiones al backend
async function fetchAPI(endpoint, method = "GET") {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(TOKEN && { Authorization: `Bearer ${TOKEN}` }),
      },
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Error en fetchAPI:", error);
    return null;
  }
}

// Formatear valores en pesos colombianos
function formatearCOP(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(valor);
}

// Mostrar datos básicos del usuario
async function cargarDatosUsuario() {
  const userData = await fetchAPI(`/usuarios/${USER_ID}`);
  const userName = document.getElementById("userName");
  const userNameDropdown = document.getElementById("userNameDropdown");
  const userEmail = document.getElementById("userEmail");
  const saldoEl = document.getElementById("saldo");

  if (!userData) {
    userName.textContent = "¡Hola!";
    userNameDropdown.textContent = "Usuario";
    userEmail.textContent = "Error al cargar datos";
    saldoEl.textContent = "—";
    return;
  }

  const nombreCompleto = userData.nombre || "Usuario";
  userName.textContent = `¡Hola, ${nombreCompleto.split(' ')[0]}!`;
  userNameDropdown.textContent = nombreCompleto;
  userEmail.textContent = userData.correo || "Correo no disponible";
  saldoEl.textContent = formatearCOP(userData.saldo || 0);
}

// Mostrar cantidad total de viajes
async function cargarCantidadViajes() {
  const viajesData = await fetchAPI(`/viajes/usuario/${USER_ID}`);
  const viajesEl = document.getElementById("viajes");

  if (!viajesData || !Array.isArray(viajesData)) {
    viajesEl.textContent = "0";
    return;
  }

  viajesEl.textContent = viajesData.length;
}

// Función para cerrar sesión
function cerrarSesion() {
  localStorage.removeItem("userId");
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// Inicializar el dashboard
document.addEventListener("DOMContentLoaded", async () => {
  // Verificar sesión activa
  if (!USER_ID || !TOKEN) {
    window.location.href = "login.html";
    return;
  }

  await cargarDatosUsuario();
  await cargarCantidadViajes();

  // Event listener para cerrar sesión
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      cerrarSesion();
    });
  }

  // Event listener para buscar bicicletas (opcional)
  const buscarBtn = document.getElementById("buscarBicicletasBtn");
  if (buscarBtn) {
    buscarBtn.addEventListener("click", () => {
      const origen = document.getElementById("origenInput").value;
      const destino = document.getElementById("destinoInput").value;
      
      if (!origen || !destino) {
        alert("Por favor, completa ambas direcciones");
        return;
      }
      
      // Redirigir a página de estaciones o búsqueda
      window.location.href = `user-estaciones.html?origen=${encodeURIComponent(origen)}&destino=${encodeURIComponent(destino)}`;
    });
  }
});