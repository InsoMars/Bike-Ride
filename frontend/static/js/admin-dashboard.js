document.addEventListener("DOMContentLoaded", async () => {
  const usuariosCount = document.getElementById("usuarios-count");
  const bicicletasCount = document.getElementById("bicicletas-count");
  const estacionesCount = document.getElementById("estaciones-count");

  
  usuariosCount.textContent = "--";
  bicicletasCount.textContent = "--";
  estacionesCount.textContent = "--";

  // backend
  /*
  try {
    const res = await fetch("http://localhost:8000/admin/resumen");
    const data = await res.json();

    if (res.ok) 
      usuariosCount.textContent = data.usuarios;
      bicicletasCount.textContent = data.bicicletas;
      estacionesCount.textContent = data.estaciones;
    } else {
      console.error("Error al obtener datos del resumen:", data.detail);
    }
  } catch (error) {
    console.error("No se pudo conectar al backend:", error);
  }
  */
});
