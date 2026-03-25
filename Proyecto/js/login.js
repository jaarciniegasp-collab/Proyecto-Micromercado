document.addEventListener("DOMContentLoaded", () => {
  
  let signUp = document.getElementById("signUp");
  let signIn = document.getElementById("signIn");
  let ingresar = document.getElementById("ingresar");
  let nameInput = document.getElementById("nameInput");
  let title = document.getElementById("title");
  let inputs = document.querySelectorAll("input");
  let mensaje = document.getElementById("mensaje");

  // ===== CAMBIAR A LOGIN =====
  signIn.onclick = function () {
    nameInput.style.display = "none"; // 🔥 mejor que maxHeight
    title.innerHTML = "Login";
    signUp.classList.add("disable");
    signIn.classList.remove("disable");
    mensaje.textContent = "";
  };

  // ===== CAMBIAR A REGISTRO =====
  signUp.onclick = function () {
    nameInput.style.display = "flex"; // 🔥 vuelve a aparecer bien
    title.innerHTML = "Registro";
    signUp.classList.remove("disable");
    signIn.classList.add("disable");
    mensaje.textContent = "";
  };

  // ===== VALIDAR LOGIN =====
  function validarLogin() {
    const usuario = inputs[0].value;
    const correo = inputs[1].value;
    const password = inputs[2].value;

    const esLogin = title.innerHTML === "Login";

    const userCorrecto = "koki";
    const correoCorrecto = "koki@gmail.com";
    const passCorrecto = "1234";

    // 🔥 VALIDACIÓN SEGÚN MODO
    if (esLogin) {
      if (correo === "" || password === "") {
        mensaje.textContent = "⚠️ Completa correo y contraseña";
        return;
      }
    } else {
      if (usuario === "" || correo === "" || password === "") {
        mensaje.textContent = "⚠️ Completa todos los campos";
        return;
      }
    }

    // 🔥 VALIDACIÓN DE DATOS
    if (usuario === userCorrecto &&correo === correoCorrecto &&password === passCorrecto) {
      localStorage.setItem("auth", "true");
      window.location.href = "index.html";
    } else {
      mensaje.textContent = "❌ Datos incorrectos";
    }
  }

  // ===== BOTÓN INGRESAR =====
  ingresar.addEventListener("click", validarLogin);

});