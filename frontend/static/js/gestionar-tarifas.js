const API_BASE = "http://localhost:8000/admin";
let tarifas = [];
let editando = false;
let tarifaActual = null;

//  Función genérica para consumir el backend
async function fetchAPI(endpoint, method = "GET", data = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
    ...(data && { body: JSON.stringify(data) }),
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Error en fetchAPI:", error);
    mostrarError("No se pudo conectar con el servidor.");
    return null;
  }
}

//  Mostrar error dentro de la tabla
function mostrarError(msg) {
  const tbody = document.getElementById("tarifa-table-body");
  tbody.innerHTML = `
    <tr>
      <td colspan="7" class="text-center py-10 text-red-600 font-medium">${msg}</td>
    </tr>
  `;
}

//  Formatear valores COP
function formatearCOP(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(valor);
}

//  Badge de estado
function badgeEstado(estado) {
  const activo = estado?.toLowerCase() === "activa";
  return `
    <span class="px-3 py-1 rounded-full text-xs font-semibold ${
      activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }">${activo ? "Activa" : "Inactiva"}</span>
  `;
}

//  Renderizar tabla
function renderTarifas(lista) {
  const tbody = document.getElementById("tarifa-table-body");
  tbody.innerHTML = "";

  if (!lista || lista.length === 0) {
    mostrarError("No hay tarifas registradas.");
    return;
  }

  lista.forEach((t) => {
    const tr = document.createElement("tr");
    tr.className = "hover:bg-gray-50 transition";

    tr.innerHTML = `
      <td class="px-6 py-3 text-gray-900 font-medium">${t.id_tarifa}</td>
      <td class="px-6 py-3">${t.tipo_viaje}</td>
      <td class="px-6 py-3">${t.descripcion || "N/A"}</td>
      <td class="px-6 py-3 text-center text-blue-600 font-semibold">${formatearCOP(t.tarifa_base)}</td>
      <td class="px-6 py-3 text-center text-green-600 font-semibold">${formatearCOP(t.tarifa_minuto)}</td>
      <td class="px-6 py-3 text-center">${badgeEstado(t.estado)}</td>
      <td class="px-6 py-3 text-center">
        <div class="flex justify-center gap-2">
          <button class="editar bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs"
                  data-id="${t.id_tarifa}">Editar</button>
          <button class="eliminar bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
                  data-id="${t.id_tarifa}">Eliminar</button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });

  document.querySelectorAll(".editar").forEach((btn) =>
    btn.addEventListener("click", (e) => abrirModalEdicion(e.target.dataset.id))
  );

  document.querySelectorAll(".eliminar").forEach((btn) =>
    btn.addEventListener("click", (e) => eliminarTarifa(e.target.dataset.id))
  );
}

//  Cargar tarifas desde el backend
async function cargarTarifas() {
  const data = await fetchAPI("/tarifas");
  if (data) {
    tarifas = data;
    renderTarifas(tarifas);
  }
}

//  Abrir modal en modo edición
async function abrirModalEdicion(id) {
  const tarifa = await fetchAPI(`/tarifas/${id}`);
  if (!tarifa) return;

  tarifaActual = id;
  editando = true;

  document.getElementById("modal-title").textContent = "Editar Tarifa";
  document.getElementById("submit-btn").textContent = "Actualizar";

  document.getElementById("id_tarifa").value = tarifa.id_tarifa;
  document.getElementById("tipo_viaje").value = tarifa.tipo_viaje;
  document.getElementById("descripcion").value = tarifa.descripcion || "";
  document.getElementById("tarifa_base").value = tarifa.tarifa_base;
  document.getElementById("tarifa_minuto").value = tarifa.tarifa_minuto;
  document.getElementById("estado").value = tarifa.estado;

  document.getElementById("tarifa-modal").classList.remove("hidden");
}

//  Guardar o actualizar tarifa
async function guardarTarifa(e) {
  e.preventDefault();
  const form = e.target;

  const nuevaTarifa = {
    tipo_viaje: form.tipo_viaje.value.trim(),
    descripcion: form.descripcion.value.trim(),
    tarifa_base: parseInt(form.tarifa_base.value),
    tarifa_minuto: parseInt(form.tarifa_minuto.value),
    estado: form.estado.value,
  };

  if (editando) {
    await fetchAPI(`/tarifas/${tarifaActual}`, "PUT", nuevaTarifa);
  } else {
    await fetchAPI("/tarifas", "POST", nuevaTarifa);
  }

  form.reset();
  document.getElementById("tarifa-modal").classList.add("hidden");
  editando = false;
  tarifaActual = null;
  cargarTarifas();
}

//  Eliminar tarifa
async function eliminarTarifa(id) {
  if (!confirm("¿Seguro que deseas eliminar esta tarifa?")) return;
  const res = await fetchAPI(`/tarifas/${id}`, "DELETE");
  if (res) cargarTarifas();
}

//  Filtrar tarifas
function filtrarTarifas() {
  const texto = document.getElementById("search-input").value.toLowerCase();
  const estado = document.getElementById("status-filter").value.toLowerCase();

  const filtradas = tarifas.filter((t) => {
    const matchTexto =
      t.tipo_viaje.toLowerCase().includes(texto) ||
      t.descripcion?.toLowerCase().includes(texto);
    const matchEstado = !estado || t.estado.toLowerCase() === estado;
    return matchTexto && matchEstado;
  });

  renderTarifas(filtradas);
}

//  Inicializar eventos al cargar DOM
document.addEventListener("DOMContentLoaded", () => {
  console.log("Página de tarifas cargada");
  cargarTarifas();

  const form = document.getElementById("tarifa-form");
  form.addEventListener("submit", guardarTarifa);

  document.getElementById("cerrar-modal").addEventListener("click", () => {
    document.getElementById("tarifa-modal").classList.add("hidden");
  });

  document.getElementById("cancelar-modal").addEventListener("click", () => {
    document.getElementById("tarifa-modal").classList.add("hidden");
  });

  document.getElementById("btn-crear-tarifa").addEventListener("click", () => {
    document.getElementById("tarifa-form").reset();
    document.getElementById("id_tarifa").value = "";
    document.getElementById("modal-title").textContent = "Crear Nueva Tarifa";
    document.getElementById("submit-btn").textContent = "Crear Tarifa";
    editando = false;
    document.getElementById("tarifa-modal").classList.remove("hidden");
  });

  document.getElementById("search-input").addEventListener("input", filtrarTarifas);
  document.getElementById("status-filter").addEventListener("change", filtrarTarifas);
});
