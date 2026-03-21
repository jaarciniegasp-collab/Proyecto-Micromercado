//Verificar si está logueado
if (localStorage.getItem("auth") !== "true") {
  window.location.href = "login.html";
}

//Cerrar sesión
function logout() {
  localStorage.removeItem("auth");
  window.location.href = "login.html";
}

//Cargar componentes
fetch("components/header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;
  });

fetch("components/footer.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  });

fetch("components/sidebar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("sidebar").innerHTML = data;
  });

//Cargar productos
fetch("data/productos.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("products");
    const template = document.getElementById("product-template");

    data.forEach(product => {
      const clone = template.content.cloneNode(true);

      clone.querySelector(".title").textContent = product.name;
      clone.querySelector(".price").textContent = "$" + product.price;

      container.appendChild(clone);
    });
  })
  .catch(error => console.error("Error cargando productos:", error));