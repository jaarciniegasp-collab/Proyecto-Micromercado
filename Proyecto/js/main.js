document.addEventListener("DOMContentLoaded", async () => {
  let carrito = [];
  let total = 0;

  // ============================
  // CARGAR HEADER, SIDEBAR Y FOOTER
  // ============================
  try {
    const [header, sidebar, footer] = await Promise.all([
      fetch("components/header.html").then(r => r.text()),
      fetch("components/sidebar.html").then(r => r.text()),
      fetch("components/footer.html").then(r => r.text())
    ]);

    document.getElementById("header").innerHTML = header;
    document.getElementById("sidebar").innerHTML = sidebar;
    document.getElementById("footer").innerHTML = footer;

    iniciarMenu();
    iniciarCarrito();
    cargarProductos();
    iniciarBotonContacto();

  } catch (e) {
    console.error("Error cargando componentes:", e);
  }

  // ============================
  // BOTÓN IR A CONTACTO (FOOTER)
  // ============================
  function iniciarBotonContacto() {
    const btnContacto = document.getElementById("ir-contacto");
    const footer = document.getElementById("contacto");
    const sidebarEl = document.querySelector(".sidebar");
    const overlay = document.getElementById("overlay");

    if (btnContacto && footer) {
      btnContacto.addEventListener("click", (e) => {
        e.preventDefault();
        footer.scrollIntoView({ behavior: "smooth" });

        // Cerrar menú si está abierto
        sidebarEl?.classList.remove("active");
        overlay?.classList.remove("active");
      });
    }
  }

  // ============================
  // MENÚ
  // ============================
  function iniciarMenu() {
    const btnMenu = document.getElementById("btn-menu");
    const sidebarEl = document.querySelector(".sidebar");
    const cerrar = document.getElementById("btn-cerrar");
    const overlay = document.getElementById("overlay");

    const toggle = (show) => {
      sidebarEl.classList.toggle("active", show);
      overlay.classList.toggle("active", show);
    };

    btnMenu?.addEventListener("click", () => toggle(true));
    cerrar?.addEventListener("click", () => toggle(false));
    overlay?.addEventListener("click", () => toggle(false));

    document.querySelectorAll(".submenu-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        btn.parentElement.classList.toggle("active");
      });
    });
  }

  // ============================
  // CARRITO
  // ============================
  function iniciarCarrito() {
    const lista = document.getElementById("lista-carrito");
    const totalHTML = document.getElementById("total-carrito");
    const contador = document.getElementById("contador");
    const carritoBtn = document.getElementById("carrito-btn");
    const carritoPanel = document.getElementById("carrito-panel");
    const cerrarCarrito = document.getElementById("cerrar-carrito");

    function actualizarCarrito() {
      if (!lista) return;

      lista.innerHTML = carrito
        .map((p, index) => `
          <li>
            ${p.nombre} - $${p.precio.toLocaleString()}
            <span class="eliminar" data-index="${index}">✖</span>
          </li>
        `)
        .join("");

      totalHTML.textContent = `Total: $${total.toLocaleString()}`;
      contador.textContent = carrito.length;
    }

    carritoBtn?.addEventListener("click", () => {
      carritoPanel.classList.toggle("active");
    });

    cerrarCarrito?.addEventListener("click", () => {
      carritoPanel.classList.remove("active");
    });

    // Cerrar si clic afuera
    document.addEventListener("click", (e) => {
      if (
        !carritoPanel.contains(e.target) &&
        !e.target.closest("#carrito-btn")
      ) {
        carritoPanel.classList.remove("active");
      }
    });

    // Eliminar producto
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("eliminar")) {
        const index = e.target.dataset.index;
        total -= carrito[index].precio;
        carrito.splice(index, 1);
        actualizarCarrito();
      }
    });

    // Función pública
    window.agregarAlCarrito = (p) => {
      carrito.push(p);
      total += p.precio;
      actualizarCarrito();
    };
  }

  // ============================
  // PRODUCTOS
  // ============================
  function cargarProductos() {
    const cont = document.getElementById("productos");

    fetch("data/productos.json")
      .then(r => r.json())
      .then(productos => {
        cont.innerHTML = productos
          .map(p => `
            <div class="card">
              <img src="${p.imagen}">
              <h4>${p.nombre}</h4>
              <p class="precio">$${p.precio}</p>
              <button class="btn" onclick='agregarAlCarrito(${JSON.stringify(p)})'>
                Agregar 🛒
              </button>
            </div>
          `)
          .join("");
      });
  }

});