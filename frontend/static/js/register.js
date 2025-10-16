document.addEventListener("DOMContentLoaded", () => {

  // -------- FETCH REGISTRO --------
  const signupForm = document.getElementById("register-form");
  const signupMsg = document.getElementById("register-msg");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(signupForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const res = await fetch("http://127.0.0.1:8080/api/usuarios/registro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok) {
          signupMsg.style.color = "green";
          signupMsg.textContent = "Usuario registrado con éxito!";
          signupForm.reset();
        } else {
          signupMsg.style.color = "red";
          signupMsg.textContent = result.detail || "Error al registrar usuario";
        }
      } catch (err) {
        signupMsg.style.color = "red";
        signupMsg.textContent = "Error de conexión con el servidor";
        console.error(err);
      }
    });
  }

  // -------- FETCH LOGIN --------
  const signinForm = document.getElementById("signin-form");
  const signinMsg = document.getElementById("signin-msg");

  if (signinForm) {
    signinForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(signinForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const res = await fetch("http://127.0.0.1:8080/api/usuarios/registro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok) {
          signinMsg.style.color = "green";
          signinMsg.textContent = "Login exitoso!";
          signinForm.reset();
        } else {
          signinMsg.style.color = "red";
          signinMsg.textContent = result.detail || "Email o contraseña incorrectos";
        }
      } catch (err) {
        signinMsg.style.color = "red";
        signinMsg.textContent = "Error de conexión con el servidor";
        console.error(err);
      }
    });
  }

});
