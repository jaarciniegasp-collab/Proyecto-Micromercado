// ============================================
//  Nuevas funcionalidades: Plantilla y Web Component
//  con filtro por categorías (integración con el menú)
// ============================================

let productosGlobal = [];

// Elementos del DOM donde se mostrarán las nuevas secciones
const productosContainer = document.getElementById('productos-dinamicos');
const plantillaProducto = document.getElementById('plantilla-producto');
const webComponentContainer = document.getElementById('componentes-web-container');

// ============================
// 1. Cargar JSON y guardar productos
// ============================
fetch('data/productos.json')
    .then(res => {
        if (!res.ok) throw new Error('Error al cargar productos');
        return res.json();
    })
    .then(productos => {
        productosGlobal = productos;
        mostrarProductosPorCategoria(null);   // Inicialmente mostrar todos
        configurarFiltros();                  // Conectar eventos del menú
    })
    .catch(error => {
        console.error('Error cargando productos:', error);
        if (productosContainer) productosContainer.innerHTML = '<p>Error al cargar productos. Verifica que el JSON esté en data/productos.json</p>';
        if (webComponentContainer) webComponentContainer.innerHTML = '<p>Error al cargar productos. Revisa la consola.</p>';
    });

    // ============================
    // 2. Función principal que filtra y renderiza ambas secciones
    // ============================
    function mostrarProductosPorCategoria(categoria) {
    let productosFiltrados = productosGlobal;
    if (categoria) {
        productosFiltrados = productosGlobal.filter(p => p.categoria === categoria);
    }
    renderizarConPlantilla(productosFiltrados);
    renderizarConWebComponent(productosFiltrados);
    }

    // ============================
    // 3. Renderizado usando plantilla (con botón funcional)
    // ============================
    function renderizarConPlantilla(productos) {
    if (!productosContainer || !plantillaProducto) return;
    productosContainer.innerHTML = '';

    productos.forEach(producto => {
        const clone = plantillaProducto.content.cloneNode(true);
        clone.querySelector('.producto-imagen').src = producto.imagen;
        clone.querySelector('.producto-imagen').alt = producto.nombre;
        clone.querySelector('.producto-nombre').textContent = producto.nombre;
        clone.querySelector('.producto-precio').textContent = `$${producto.precio.toLocaleString()}`;
        clone.querySelector('.producto-descripcion').textContent = producto.descripcion;

        const btn = clone.querySelector('.btn');
        if (btn) {
        btn.onclick = () => agregarAlCarrito(producto);
        }
        productosContainer.appendChild(clone);
    });
    }

    // ============================
    // 4. Renderizado usando componente web (con botón agregado)
    // ============================
    function renderizarConWebComponent(productos) {
    if (!webComponentContainer) return;
    webComponentContainer.innerHTML = '';

    productos.forEach(producto => {
        const tarjeta = document.createElement('tarjeta-producto');
        tarjeta.setAttribute('nombre', producto.nombre);
        tarjeta.setAttribute('precio', producto.precio);
        tarjeta.setAttribute('descripcion', producto.descripcion);
        tarjeta.setAttribute('imagen', producto.imagen);
        tarjeta.productoData = producto;   // Guardamos el objeto completo para el botón
        webComponentContainer.appendChild(tarjeta);
    });
    }

    // ============================
    // 5. Definición del Web Component <tarjeta-producto>
    // ============================
    class TarjetaProducto extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const estilo = document.createElement('style');
        estilo.textContent = `
        :host {
            display: block;
            font-family: system-ui, sans-serif;
        }
        .tarjeta {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 8px 0 12px -6px rgba(0,0,0,0.2), -8px 0 12px -6px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1);
            transition: transform 0.2s;
            max-width: 240px;
            width: 100%;
        }
        .tarjeta:hover {
            transform: translateY(-5px);
        }
        .imagen {
            width: 100%;
            aspect-ratio: 1 / 1;
            object-fit: cover;
            background: #f5f5f5;
            max-height: 180px;
        }
        .info {
            padding: 0.8rem;
            text-align: center;
        }
        .nombre {
            font-size: 1rem;
            font-weight: 600;
            margin: 0 0 0.4rem;
            color: #333;
        }
        .precio {
            font-size: 1.1rem;
            font-weight: 700;
            color: #2c7a4d;
            margin: 0 0 0.4rem;
        }
        .descripcion {
            font-size: 0.8rem;
            color: #666;
            margin: 0 0 0.8rem;
        }
        .btn {
            background: orange;
            border: none;
            border-radius: 20px;
            padding: 8px 12px;
            color: white;
            cursor: pointer;
            font-size: 0.9rem;
            width: 100%;
        }
        .btn:hover {
            background: #e67e00;
        }
        `;
        const contenedor = document.createElement('div');
        contenedor.classList.add('tarjeta');
        this.shadowRoot.appendChild(estilo);
        this.shadowRoot.appendChild(contenedor);
    }

    static get observedAttributes() { return ['nombre', 'precio', 'descripcion', 'imagen']; }
    attributeChangedCallback() { this.actualizarVista(); }
    connectedCallback() { this.actualizarVista(); }

    actualizarVista() {
        const nombre = this.getAttribute('nombre') || 'Producto';
        const precio = this.getAttribute('precio') || '0';
        const descripcion = this.getAttribute('descripcion') || '';
        const imagen = this.getAttribute('imagen') || 'https://picsum.photos/id/20/300/300';
        const contenedor = this.shadowRoot.querySelector('.tarjeta');
        if (!contenedor) return;

        contenedor.innerHTML = `
        <img class="imagen" src="${imagen}" alt="${nombre}" loading="lazy">
        <div class="info">
            <h3 class="nombre">${nombre}</h3>
            <p class="precio">$${parseInt(precio).toLocaleString()}</p>
            <p class="descripcion">${descripcion}</p>
            <button class="btn">Agregar 🛒</button>
        </div>
        `;

        const btn = contenedor.querySelector('.btn');
        if (btn && this.productoData) {
        btn.onclick = () => agregarAlCarrito(this.productoData);
        }
    }
    }
    customElements.define('tarjeta-producto', TarjetaProducto);

    // ============================
    // 6. Configurar filtros escuchando el menú lateral
    // ============================
    function configurarFiltros() {
    // Esperamos un poco a que el sidebar se haya cargado (lo hace main.js)
    setTimeout(() => {
        const btnInicio = document.querySelector(".menu li a");
        if (btnInicio) {
        btnInicio.addEventListener("click", (e) => {
            e.preventDefault();
            mostrarProductosPorCategoria(null);
        });
        }

        const itemsCategoria = document.querySelectorAll(".submenu-items li a");
        itemsCategoria.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const categoriaTexto = item.textContent.trim();
            let categoriaClave = "";
            switch (categoriaTexto) {
            case "Viveres": categoriaClave = "viveres"; break;
            case "Lacteos y Huevos": categoriaClave = "lacteos y huevos"; break;
            case "Licores": categoriaClave = "licores"; break;
            case "Dulces": categoriaClave = "dulces"; break;
            case "Cuidado personal": categoriaClave = "cuidado personal"; break;
            default: categoriaClave = categoriaTexto.toLowerCase();
            }
            mostrarProductosPorCategoria(categoriaClave);
        });
        });
    }, 200);
    }