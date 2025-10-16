// La URL base de tu backend FastAPI, haciendo que sea más fácil de cambiar si el dominio se modifica
const API_URL = "http://localhost:8080/api";

const loginForm = document.getElementById("login-form");
const loginMsg = document.getElementById("login-msg");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Limpiar mensaje anterior
  loginMsg.textContent = "Cargando...";
  loginMsg.className = "text-center text-sm font-medium text-blue-600 bg-blue-50 py-2 px-4 rounded-lg border border-blue-200";

  const formData = new FormData(loginForm);
  const data = Object.fromEntries(formData.entries());

  try {
    // Usa la constante API_URL para el fetch
    const res = await fetch(`${API_URL}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      // 🛑 CORRECCIÓN CLAVE: Usar 'rol_nombre' en lugar de 'rol'
      const rol = result.rol_nombre ? result.rol_nombre.toLowerCase() : '';

      // Mensaje de éxito 
      loginMsg.className = "text-center text-sm font-medium text-green-600 bg-green-50 py-2 px-4 rounded-lg border border-green-200";
      loginMsg.textContent = "✓ Inicio de sesión exitoso. Redirigiendo...";

      setTimeout(() => {
        if (rol === "admin") {
          window.location.href = "admin-dashboard.html";
        } else {
          window.location.href = "user-dashboard.html";
        }
      }, 1500);
    } else {
      // Mensaje de error (si las credenciales son incorrectas)
      loginMsg.className = "text-center text-sm font-medium text-red-600 bg-red-50 py-2 px-4 rounded-lg border border-red-200";
      loginMsg.textContent = result.detail || "Credenciales incorrectas.";
    }
  } catch (error) {
    // Mensaje de error de conexión
    loginMsg.className = "text-center text-sm font-medium text-red-600 bg-red-50 py-2 px-4 rounded-lg border border-red-200";
    loginMsg.textContent = "⚠ Error de conexión con el servidor.";
    console.error("Error en la conexión o la petición:", error);
  }
});
