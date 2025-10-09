const loginForm = document.getElementById("login-form");
const loginMsg = document.getElementById("login-msg");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Limpiar mensaje anterior
  loginMsg.textContent = "";
  loginMsg.className = "text-center text-sm font-medium";

  const formData = new FormData(loginForm);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch("http://localhost:8000/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      const rol = result.rol?.toLowerCase();

      // Mensaje de éxito 
      loginMsg.className = "text-center text-sm font-medium text-green-600 bg-green-50 py-2 px-4 rounded-lg border border-green-200";
      loginMsg.textContent = "✓ Inicio de sesión exitoso";

      setTimeout(() => {
        if (rol === "admin") {
          window.location.href = "admin-dashboard.html";
        } else {
          window.location.href = "dashboard.html";
        }
      }, 1500);
    } else {
      // Mensaje de error 
      loginMsg.className = "text-center text-sm font-medium text-red-600 bg-red-50 py-2 px-4 rounded-lg border border-red-200";
      loginMsg.textContent = result.detail || "Credenciales incorrectas.";
    }
  } catch (error) {
    // Mensaje de error 
    loginMsg.className = "text-center text-sm font-medium text-red-600 bg-red-50 py-2 px-4 rounded-lg border border-red-200";
    loginMsg.textContent = "⚠ Error de conexión con el servidor.";
    console.error(error);
  }
});