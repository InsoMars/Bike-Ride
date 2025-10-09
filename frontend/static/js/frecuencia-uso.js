document.addEventListener("DOMContentLoaded", async () => {
  const tabla = document.getElementById("tablaFrecuencia");
  const filtrarBtn = document.getElementById("filtrarBtn");
  const excelBtn = document.getElementById("excelBtn");
  const pdfBtn = document.getElementById("pdfBtn");

  // Función para obtener badge de estado con colores
  const getBadgeEstado = (estado) => {
    const estados = {
      'disponible': 'bg-green-100 text-green-800',
      'en uso': 'bg-blue-100 text-blue-800',
      'mantenimiento': 'bg-yellow-100 text-yellow-800',
      'fuera de servicio': 'bg-red-100 text-red-800'
    };
    const estadoLower = estado?.toLowerCase() || 'disponible';
    const clase = estados[estadoLower] || 'bg-gray-100 text-gray-800';
    return `<span class="px-2 py-1 rounded-full text-xs font-semibold ${clase}">${estado}</span>`;
  };

  filtrarBtn.addEventListener("click", async () => {
    const fechaInicio = document.getElementById("fechaInicio").value;
    const fechaFin = document.getElementById("fechaFin").value;
    const tipo = document.getElementById("tipoBicicleta").value;

    try {
      const res = await fetch(`http://localhost:8000/reportes/frecuencia-uso?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&tipo=${tipo}`);
      const data = await res.json();

      if (res.ok && data.length > 0) {
        tabla.innerHTML = data
          .map(
            (b) => `
            <tr class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">${b.id_bicicleta}</td>
              <td class="px-6 py-4 text-gray-700 whitespace-nowrap">${b.tipo}</td>
              <td class="px-6 py-4 text-gray-700 whitespace-nowrap">${b.estacion}</td>
              <td class="px-6 py-4 text-center font-semibold text-blue-600 whitespace-nowrap">${b.total_viajes}</td>
              <td class="px-6 py-4 text-gray-700 whitespace-nowrap">${b.ultimo_uso}</td>
              <td class="px-6 py-4 text-center text-gray-700 whitespace-nowrap">${b.promedio_dia}</td>
              <td class="px-6 py-4 text-center whitespace-nowrap">${getBadgeEstado(b.estado)}</td>
            </tr>`
          )
          .join("");
      } else {
        tabla.innerHTML = `
          <tr>
            <td colspan="7" class="text-center py-12">
              <div class="flex flex-col items-center justify-center text-gray-400">
                <svg class="w-16 h-16 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-sm font-medium">No hay resultados</p>
              </div>
            </td>
          </tr>
        `;
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      tabla.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-12">
            <div class="flex flex-col items-center justify-center text-red-500">
              <svg class="w-16 h-16 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm font-medium">Error al conectar con el servidor</p>
            </div>
          </td>
        </tr>
      `;
    }
  });

  excelBtn.addEventListener("click", () => {
    window.open("http://localhost:8000/reportes/frecuencia-uso/excel", "_blank");
  });

  pdfBtn.addEventListener("click", () => {
    window.open("http://localhost:8000/reportes/frecuencia-uso/pdf", "_blank");
  });
});