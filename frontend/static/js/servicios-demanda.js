document.addEventListener("DOMContentLoaded", async () => {
  const tabla = document.getElementById("tablaServicios");
  const filtrarBtn = document.getElementById("filtrarBtn");
  const excelBtn = document.getElementById("excelBtn");
  const pdfBtn = document.getElementById("pdfBtn");

  // Cargar datos al presionar Filtrar
  filtrarBtn.addEventListener("click", async () => {
    const fechaInicio = document.getElementById("fechaInicio").value;
    const fechaFin = document.getElementById("fechaFin").value;

    try {
      const res = await fetch(`http://localhost:8000/reportes/servicios-demandados?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
      const data = await res.json();

      if (res.ok && data.length > 0) {
        tabla.innerHTML = data
          .map(
            (s, index) => `
            <tr class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 font-medium text-gray-900">${s.id_tipo_viaje}</td>
              <td class="px-6 py-4 text-gray-700">${s.tipo}</td>
              <td class="px-6 py-4 text-center font-semibold text-blue-600">${s.total_viajes}</td>
              <td class="px-6 py-4 text-center text-gray-700">${s.duracion_promedio?.toFixed(1) || "-"}</td>
              <td class="px-6 py-4 text-center text-gray-700">$${s.tarifa_promedio?.toLocaleString("es-CO") || "-"}</td>
              <td class="px-6 py-4 text-center text-gray-700">${s.porcentaje || 0}%</td>
              <td class="px-6 py-4 text-center font-bold">${index + 1}</td>
            </tr>`
          )
          .join("");
      } else {
        tabla.innerHTML = `
          <tr>
            <td colspan="7" class="text-center py-10 text-gray-400">No hay resultados disponibles</td>
          </tr>`;
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      tabla.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-10 text-red-500">
            Error al conectar con el servidor
          </td>
        </tr>`;
    }
  });

  // Descargar Excel
  excelBtn.addEventListener("click", () => {
    window.open("http://localhost:8000/reportes/servicios-demandados/excel", "_blank");
  });

  // Descargar PDF
  pdfBtn.addEventListener("click", () => {
    window.open("http://localhost:8000/reportes/servicios-demandados/pdf", "_blank");
  });
});