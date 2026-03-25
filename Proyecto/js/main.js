document.addEventListener("DOMContentLoaded", async () => {
  let carrito = [];
  let total = 0;
  let productosGlobal = []; // ← Guardaremos todos los productos para filtrar después

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
    cargarProductos();         // Carga todos los productos al inicio
    iniciarBotonContacto();
    configurarFiltros();       // ← NUEVO: asigna eventos a las categorías
  } catch (e) {
    console.error("Error cargando componentes:", e);
  }

  // ============================
  // NUEVA FUNCIÓN: CONFIGURAR FILTROS POR CATEGORÍA
  // ============================
  function configurarFiltros() {
    // Esperamos un momento a que el sidebar esté completamente renderizado
    setTimeout(() => {
      // Botón "Inicio" (primer enlace del menú)
      const btnInicio = document.querySelector(".menu li a");
      if (btnInicio) {
        btnInicio.addEventListener("click", (e) => {
          e.preventDefault();
          mostrarProductosPorCategoria(null); // null = todos los productos
          // Opcional: marcar como activo el enlace de inicio (puedes agregar estilos)
          document.querySelectorAll(".menu li a").forEach(a => a.classList.remove("active"));
          btnInicio.classList.add("active");
        });
      }

      // Elementos de las subcategorías (viveres, lacteos, etc.)
      const itemsCategoria = document.querySelectorAll(".submenu-items li a");
      itemsCategoria.forEach(item => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          const categoriaTexto = item.textContent.trim(); // ej: "Viveres"
          // Convertimos el texto a la clave que usamos en el JSON
          let categoriaClave = "";
          switch (categoriaTexto) {
            case "Viveres":
              categoriaClave = "viveres";
              break;
            case "Lacteos y Huevos":
              categoriaClave = "lacteos y huevos";
              break;
            case "Licores":
              categoriaClave = "licores";
              break;
            case "Dulces":
              categoriaClave = "dulces";
              break;
            case "Cuidado personal":
              categoriaClave = "cuidado personal";
              break;
            default:
              categoriaClave = categoriaTexto.toLowerCase();
          }
          mostrarProductosPorCategoria(categoriaClave);
          // Marcar como activo el elemento seleccionado (opcional)
          document.querySelectorAll(".menu li a").forEach(a => a.classList.remove("active"));
          document.querySelectorAll(".submenu-items li a").forEach(a => a.classList.remove("active"));
          item.classList.add("active");
        });
      });
    }, 100); // pequeño retraso para asegurar que el DOM del sidebar ya existe
  }

  // ============================
  // FUNCIÓN PARA MOSTRAR PRODUCTOS FILTRADOS
  // ============================
  function mostrarProductosPorCategoria(categoria) {
    const contenedor = document.getElementById("productos");
    if (!contenedor) return;

    let productosFiltrados = productosGlobal;
    if (categoria) {
      productosFiltrados = productosGlobal.filter(p => p.categoria === categoria);
    }

    // Renderizamos las tarjetas (mismo código que en cargarProductos)
    contenedor.innerHTML = productosFiltrados
      .map(p => `
        <div class="card">
          <img src="${p.imagen}">
          <h4>${p.nombre}</h4>
          <p class="precio">$${p.precio.toLocaleString()}</p>
          <button class="btn" onclick='agregarAlCarrito(${JSON.stringify(p)})'>
            Agregar 🛒
          </button>
        </div>
      `)
      .join("");
  }

  // ============================
  // CARGA DE PRODUCTOS DESDE JSON (MODIFICADA)
  // ============================
  function cargarProductos() {
    fetch("data/productos.json")
      .then(r => r.json())
      .then(productos => {
        productosGlobal = productos;               // guardamos copia global
        mostrarProductosPorCategoria(null);       // mostramos todos al inicio
      })
      .catch(err => console.error("Error cargando productos:", err));
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
        sidebarEl?.classList.remove("active");
        overlay?.classList.remove("active");
      });
    }
  }

  // ============================
  // MENÚ LATERAL (SIDEBAR)
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
  // CARRITO (sin cambios)
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

    document.addEventListener("click", (e) => {
      if (
        !carritoPanel.contains(e.target) &&
        !e.target.closest("#carrito-btn")
      ) {
        carritoPanel.classList.remove("active");
      }
    });

    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("eliminar")) {
        const index = e.target.dataset.index;
        total -= carrito[index].precio;
        carrito.splice(index, 1);
        actualizarCarrito();
      }
    });

    window.agregarAlCarrito = (p) => {
      carrito.push(p);
      total += p.precio;
      actualizarCarrito();
    };
  }
});