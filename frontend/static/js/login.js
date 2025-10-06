const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

// -------- FETCH REGISTRO --------
const signupForm = document.getElementById("signup-form");
const signupMsg = document.getElementById("signup-msg");

signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(signupForm);
    const data = Object.fromEntries(formData.entries());

    try {
        const res = await fetch("http://localhost:8000/usuarios/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
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

// -------- FETCH LOGIN --------
const signinForm = document.getElementById("signin-form");
const signinMsg = document.getElementById("signin-msg");

signinForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(signinForm);
    const data = Object.fromEntries(formData.entries());

    try {
        const res = await fetch("http://localhost:8000/usuarios/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok) {
            signinMsg.style.color = "green";
            signinMsg.textContent = "Login exitoso!";
            signinForm.reset();
            // Aquí podrías redirigir a otra página
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
