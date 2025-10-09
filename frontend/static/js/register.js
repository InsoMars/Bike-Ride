const registerForm = document.getElementById("register-form");
const registerMsg = document.getElementById("register-msg");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Limpiar mensaje anterior
  registerMsg.textContent = "";
  registerMsg.className = "text-center text-sm font-medium";

  const formData = new FormData(registerForm);
  const data = Object.fromEntries(formData.entries());

  // Solo hay un admin, los demás son usuarios
  data.id_rol = 2;

  try {
    const res = await fetch("http://localhost:8000/usuarios/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      // Mensaje de éxito con estilo mejorado
      registerMsg.className = "text-center text-sm font-medium text-green-600 bg-green-50 py-2 px-4 rounded-lg border border-green-200";
      registerMsg.textContent = "✓ Registro exitoso. Redirigiendo...";
      registerForm.reset();

      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    } else {
      // Mensaje de error con estilo mejorado
      registerMsg.className = "text-center text-sm font-medium text-red-600 bg-red-50 py-2 px-4 rounded-lg border border-red-200";
      registerMsg.textContent = result.detail || "Error al crear la cuenta. Intenta de nuevo.";
    }
  } catch (error) {
    // Mensaje de error de conexión
    registerMsg.className = "text-center text-sm font-medium text-red-600 bg-red-50 py-2 px-4 rounded-lg border border-red-200";
    registerMsg.textContent = "⚠ Error de conexión con el servidor.";
    console.error(error);
  }
});