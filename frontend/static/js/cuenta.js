document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://127.0.0.1:8080/api";
  const userId = sessionStorage.getItem("userId") || localStorage.getItem("userId");

  let usuarioData = null;

  // -------- ELEMENTOS DEL DOM --------
  const formPerfil = document.getElementById("form-perfil");
  const formPassword = document.getElementById("form-password");
  const btnEditarPerfil = document.getElementById("btn-editar-perfil");
  const btnGuardarPerfil = document.getElementById("btn-guardar-perfil");
  const btnCancelarPerfil = document.getElementById("btn-cancelar-perfil");

  // -------- CARGA DE DATOS --------
  
  async function cargarDatosUsuario() {
    try {
      const res = await fetch(`${API_URL}/usuarios/${userId}`);
      if (!res.ok) throw new Error("Error al cargar usuario");
      
      usuarioData = await res.json();
      
      // Llenar campos del perfil
      document.getElementById("nombre").value = usuarioData.nombre || "";
      document.getElementById("apellido").value = usuarioData.apellido || "";
      document.getElementById("correo").value = usuarioData.correo || "";
      document.getElementById("celular").value = usuarioData.celular || "";
      document.getElementById("id_rol").value = usuarioData.id_rol || "";
      
      // Mostrar en header
      document.getElementById("userNameDropdown").textContent = usuarioData.nombre || "Usuario";
      document.getElementById("userEmail").textContent = usuarioData.correo || "";
      
      // Mostrar rol
      const rolBadge = document.getElementById("rol-badge");
      if (rolBadge) {
        const roles = { 1: "Administrador", 2: "Usuario", 3: "Operador" };
        rolBadge.textContent = roles[usuarioData.id_rol] || "Usuario";
      }
      
    } catch (err) {
      console.error("Error al cargar usuario:", err);
      mostrarError("No se pudieron cargar los datos del usuario");
    }
  }

  // -------- EDITAR PERFIL --------
  
  function habilitarEdicion() {
    const campos = formPerfil.querySelectorAll("input:not(#correo):not(#id_rol)");
    campos.forEach(campo => campo.removeAttribute("readonly"));
    
    btnEditarPerfil.classList.add("hidden");
    btnGuardarPerfil.classList.remove("hidden");
    btnCancelarPerfil.classList.remove("hidden");
    
    document.getElementById("info-edicion")?.classList.remove("hidden");
  }

  function cancelarEdicion() {
    cargarDatosUsuario();
    
    const campos = formPerfil.querySelectorAll("input");
    campos.forEach(campo => campo.setAttribute("readonly", ""));
    
    btnEditarPerfil.classList.remove("hidden");
    btnGuardarPerfil.classList.add("hidden");
    btnCancelarPerfil.classList.add("hidden");
    
    document.getElementById("info-edicion")?.classList.add("hidden");
    document.getElementById("error-perfil")?.classList.add("hidden");
    document.getElementById("exito-perfil")?.classList.add("hidden");
  }

  async function guardarPerfil(e) {
    e.preventDefault();
    
    const formData = new FormData(formPerfil);
    const data = {
      nombre: formData.get("nombre"),
      apellido: formData.get("apellido"),
      celular: formData.get("celular")
    };
    
    // Validaciones
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(data.nombre)) {
      mostrarErrorPerfil("El nombre solo puede contener letras");
      return;
    }
    
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(data.apellido)) {
      mostrarErrorPerfil("El apellido solo puede contener letras");
      return;
    }
    
    if (!/^\d{10}$/.test(data.celular)) {
      mostrarErrorPerfil("El celular debe tener 10 dígitos");
      return;
    }
    
    btnGuardarPerfil.disabled = true;
    btnGuardarPerfil.textContent = "Guardando...";
    
    try {
      const res = await fetch(`${API_URL}/usuarios/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      const result = await res.json();
      
      if (res.ok) {
        mostrarExitoPerfil("✓ Perfil actualizado exitosamente");
        await cargarDatosUsuario();
        
        setTimeout(() => {
          cancelarEdicion();
        }, 1500);
      } else {
        mostrarErrorPerfil(result.detail || "Error al actualizar el perfil");
      }
    } catch (err) {
      console.error("Error:", err);
      mostrarErrorPerfil("Error de conexión con el servidor");
    } finally {
      btnGuardarPerfil.disabled = false;
      btnGuardarPerfil.textContent = "Guardar Cambios";
    }
  }

  // -------- CAMBIAR CONTRASEÑA --------
  
  async function cambiarPassword(e) {
    e.preventDefault();
    
    const formData = new FormData(formPassword);
    const passwordActual = formData.get("password_actual");
    const passwordNueva = formData.get("password_nueva");
    const passwordConfirmar = formData.get("password_confirmar");
    
    // Validaciones
    if (passwordNueva.length < 8) {
      mostrarErrorPassword("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    
    if (passwordNueva !== passwordConfirmar) {
      mostrarErrorPassword("Las contraseñas no coinciden");
      return;
    }
    
    if (passwordActual === passwordNueva) {
      mostrarErrorPassword("La nueva contraseña debe ser diferente a la actual");
      return;
    }
    
    const submitBtn = document.getElementById("btn-cambiar-password");
    submitBtn.disabled = true;
    submitBtn.textContent = "Cambiando...";
    
    try {
      const res = await fetch(`${API_URL}/usuarios/${userId}/cambiar-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password_actual: passwordActual,
          password_nueva: passwordNueva
        })
      });
      
      const result = await res.json();
      
      if (res.ok) {
        mostrarExitoPassword("✓ Contraseña actualizada exitosamente");
        formPassword.reset();
      } else {
        mostrarErrorPassword(result.detail || "Error al cambiar la contraseña");
      }
    } catch (err) {
      console.error("Error:", err);
      mostrarErrorPassword("Error de conexión con el servidor");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Cambiar Contraseña";
    }
  }

  // -------- MENSAJES --------
  
  function mostrarErrorPerfil(mensaje) {
    const errorDiv = document.getElementById("error-perfil");
    const errorTexto = document.getElementById("error-perfil-texto");
    if (errorTexto) errorTexto.textContent = mensaje;
    errorDiv?.classList.remove("hidden");
    errorDiv?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function mostrarExitoPerfil(mensaje) {
    const exitoDiv = document.getElementById("exito-perfil");
    const exitoTexto = document.getElementById("exito-perfil-texto");
    if (exitoTexto) exitoTexto.textContent = mensaje;
    exitoDiv?.classList.remove("hidden");
    setTimeout(() => exitoDiv?.classList.add("hidden"), 3000);
  }

  function mostrarErrorPassword(mensaje) {
    const errorDiv = document.getElementById("error-password");
    const errorTexto = document.getElementById("error-password-texto");
    if (errorTexto) errorTexto.textContent = mensaje;
    errorDiv?.classList.remove("hidden");
    errorDiv?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function mostrarExitoPassword(mensaje) {
    const exitoDiv = document.getElementById("exito-password");
    const exitoTexto = document.getElementById("exito-password-texto");
    if (exitoTexto) exitoTexto.textContent = mensaje;
    exitoDiv?.classList.remove("hidden");
    setTimeout(() => exitoDiv?.classList.add("hidden"), 3000);
  }

  // -------- ELIMINAR CUENTA --------
  
  window.eliminarCuenta = async function() {
    const confirmar = prompt("Para eliminar tu cuenta, escribe 'ELIMINAR' en mayúsculas:");
    
    if (confirmar !== "ELIMINAR") {
      if (confirmar !== null) {
        alert("Cancelado. La cuenta no se eliminará.");
      }
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/usuarios/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
      
      const result = await res.json();
      
      if (res.ok) {
        alert("Cuenta eliminada exitosamente. Serás redirigido al inicio.");
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = "index.html";
      } else {
        alert(result.detail || "Error al eliminar la cuenta");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error de conexión con el servidor");
    }
  };

  // -------- EVENT LISTENERS --------
  
  btnEditarPerfil?.addEventListener("click", habilitarEdicion);
  btnGuardarPerfil?.addEventListener("click", guardarPerfil);
  btnCancelarPerfil?.addEventListener("click", cancelarEdicion);
  formPerfil?.addEventListener("submit", guardarPerfil);
  formPassword?.addEventListener("submit", cambiarPassword);
  
  document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "index.html";
  });

  // -------- INICIALIZAR --------
  (async function() {
    await cargarDatosUsuario();
    
    // Todos los campos readonly por defecto
    const campos = formPerfil?.querySelectorAll("input");
    campos?.forEach(campo => campo.setAttribute("readonly", ""));
  })();
});