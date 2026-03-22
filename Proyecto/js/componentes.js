// ========== NUEVAS FUNCIONALIDADES ==========
// Carga de productos desde JSON con plantilla
    const productosContainer = document.getElementById('productos-dinamicos');
    const plantillaProducto = document.getElementById('plantilla-producto');

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
        productosContainer.appendChild(clone);
    });
    }

    // Web Component personalizado
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
            max-height: 180px;   /* Imagen más pequeña */
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
            margin: 0;
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
        </div>
        `;
    }
    }
    customElements.define('tarjeta-producto', TarjetaProducto);

    // Cargar JSON y renderizar
    fetch('data/productos.json')
    .then(res => {
        if (!res.ok) throw new Error('Error al cargar productos');
        return res.json();
    })
    .then(productos => {
        renderizarConPlantilla(productos);
        const webComponentContainer = document.getElementById('componentes-web-container');
        if (webComponentContainer) {
        webComponentContainer.innerHTML = '';
        productos.forEach(producto => {
            const tarjeta = document.createElement('tarjeta-producto');
            tarjeta.setAttribute('nombre', producto.nombre);
            tarjeta.setAttribute('precio', producto.precio);
            tarjeta.setAttribute('descripcion', producto.descripcion);
            tarjeta.setAttribute('imagen', producto.imagen);
            webComponentContainer.appendChild(tarjeta);
        });
        }
    })
    .catch(error => {
        console.error('Error cargando productos:', error);
        if (productosContainer) productosContainer.innerHTML = '<p>Error al cargar productos. Verifica que el archivo JSON exista en data/productos.json</p>';
        const webComponentContainer = document.getElementById('componentes-web-container');
        if (webComponentContainer) webComponentContainer.innerHTML = '<p>Error al cargar productos. Revisa la consola.</p>';
    });