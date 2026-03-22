let signUp = document.getElementById("signUp");
let signIn = document.getElementById("signIn");
let ingresar = document.getElementById("ingresar");
let nameInput = document.getElementById("nameInput");
let title = document.getElementById("title");

let inputs = document.querySelectorAll("input");

// cambiar a LOGIN
signIn.onclick = function () {
  nameInput.style.maxHeight = "0";
  title.innerHTML = "Login";
  signUp.classList.add("disable");
  signIn.classList.remove("disable");
};

// cambiar a REGISTRO
signUp.onclick = function () {
  nameInput.style.maxHeight = "60px";
  title.innerHTML = "Registro";
  signUp.classList.remove("disable");
  signIn.classList.add("disable");
};

// VALIDAR LOGIN
function validarLogin() {
  const usuario = inputs[0].value;
  const correo = inputs[1].value;
  const password = inputs[2].value;

  const userCorrecto = "koki";
  const correoCorrecto = "koki@gmail.com";
  const passCorrecto = "1234";

  if (usuario === "" || correo === "" || password === "") {
    mensaje.textContent = "⚠️ Por favor completa todos los campos";
    return;
  }

  if (
    usuario === userCorrecto &&
    correo === correoCorrecto &&
    password === passCorrecto
  ) {
    localStorage.setItem("auth", "true");
    window.location.href = "index.html";
  } else {
    alert("Datos incorrectos ❌");
  }
}

// botón ingresar
ingresar.addEventListener("click", validarLogin);