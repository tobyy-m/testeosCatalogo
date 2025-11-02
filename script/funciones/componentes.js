/* ============================================ */
/* SISTEMA DE CARGA OPTIMIZADA DE COMPONENTES */
/* ============================================ */

// Configuración de rutas según el nivel de carpeta
const CONFIG = {
  routes: {
    index: {
      css: 'css/styles.css',
      navbar: 'componentes/navbar.html',
      footer: 'componentes/footer.html',
      modal: 'componentes/modalBootstrap.html',
      navLinks: [
        { href: '#quienes-somos', text: 'Quiénes Somos' },
        { href: '#servicios', text: 'Servicios' }
      ]
    },
    catalog: {
      css: 'css/styles.css',
      navbar: 'componentes/navbar.html',
      footer: 'componentes/footer.html',
      modal: 'componentes/modalBootstrap.html',
      navLinks: [
        { href: '#diseños', text: 'Diseños' },
        { href: 'index.html', text: 'Inicio' },
        { href: 'remeras.html', text: 'Remeras' },
        { href: 'tazas.html', text: 'Tazas' }
      ]
    },
    product: {
      css: '../../css/styles.css',
      navbar: '../../componentes/navbar.html',
      footer: '../../componentes/footer.html',
      modal: '../../componentes/modalBootstrap.html',
      navLinks: [
        { href: '../../index.html', text: 'Inicio' },
        { href: '../../buzos.html', text: 'Buzos' },
        { href: '../../remeras.html', text: 'Remeras' },
        { href: '../../tazas.html', text: 'Tazas' }
      ]
    }
  }
};

// Detectar tipo de página automáticamente
function detectPageType() {
  const path = window.location.pathname;
  if (path.includes('/productos/')) return 'product';
  if (path.includes('buzos.html') || path.includes('remeras.html') || path.includes('tazas.html')) return 'catalog';
  return 'index';
}

// Cargar componentes optimizados
function loadOptimizedComponents() {
  const pageType = detectPageType();
  const config = CONFIG.routes[pageType];
  
  // Actualizar ruta del CSS si es necesario
  const customCSS = document.getElementById('custom-css');
  if (customCSS && customCSS.href !== config.css) {
    customCSS.href = config.css;
  }
  
  // Cargar navbar y configurar enlaces
  loadComponent('navbar-container', config.navbar, () => {
    setupNavigation(config.navLinks);
  });
  
  // Cargar footer
  loadComponent('footer-container', config.footer);
  
  // Cargar modal del carrito
  loadComponent('modal-container', config.modal, () => {
    configurarModalCarrito();
  });
}

// Función optimizada para cargar componentes
function loadComponent(containerId, filePath, callback) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  fetch(filePath)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.text();
    })
    .then(html => {
      container.innerHTML = html;
      if (callback) callback();
    })
    .catch(error => {
      console.warn(`Error loading component ${filePath}:`, error);
    });
}

// Configurar navegación dinámica
function setupNavigation(links) {
  const navLinks = document.getElementById('nav-links');
  if (!navLinks || !links) return;
  
  navLinks.innerHTML = links.map(link => 
    `<li class="nav-item"><a class="nav-link" href="${link.href}">${link.text}</a></li>`
  ).join('');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadOptimizedComponents);

// =====================
// Price loader from central config
// =====================
async function applyPricesFromConfig() {
  const possiblePaths = [
    '/script/config/prices.json',
    '/tienda/script/config/prices.json',
    'script/config/prices.json',
    '../config/prices.json',
    '../../script/config/prices.json'
  ];

  let data = null;
  for (const p of possiblePaths) {
    try {
      const resp = await fetch(p);
      if (!resp.ok) continue;
      data = await resp.json();
      break;
    } catch (e) {
      // try next
    }
  }
  if (!data) return; // no config found

  // Determine category and product key from URL
  const path = window.location.pathname.toLowerCase();
  const parts = path.split('/');
  const file = parts.pop() || parts.pop();
  const productKey = (file || '').replace(/\.html$/i, '');
  const productKeyLower = (productKey || '').toLowerCase();

  let category = null;
  if (path.includes('/productos/tazas/')) category = 'tazas';
  else if (path.includes('/productos/remeras/')) category = 'remeras';
  else if (path.includes('/productos/buzos/')) category = 'buzos';
  else if (path.includes('/productos/gorras/')) category = 'gorras';

  if (!category) return;

  let price = null;
  // per-product override (case-insensitive lookup)
  if (data[category] && data[category].products) {
    // Try direct key first
    if (data[category].products[productKey] !== undefined) {
      price = data[category].products[productKey];
    } else {
      // Case-insensitive scan of product keys (handles camelCase in JSON)
      const entries = Object.entries(data[category].products);
      for (const [k, v] of entries) {
        if ((k || '').toLowerCase() === productKeyLower) {
          price = v;
          break;
        }
      }
    }
  }

  // category defaults and special cases
  if (!price) {
    if (category === 'tazas') {
      price = (data.tazas && data.tazas.default) || data.defaults.tazas;
    } else if (category === 'remeras') {
      // detect niño vs adulto: if any talle-option with numeric <=16 assume niño
      const talleOptions = Array.from(document.querySelectorAll('#talleSelector .talle-option'));
      const isNino = talleOptions.some(opt => {
        const v = opt.dataset.talle;
        const n = parseInt(v, 10);
        return !isNaN(n) && n <= 16;
      });
      price = isNino ? (data.remeras.default_nino || data.defaults.remeras_nino) : (data.remeras.default_adulto || data.defaults.remeras_adulto);
    } else if (category === 'buzos') {
      price = (data.buzos && data.buzos.default) || data.defaults.buzos;
    } else if (category === 'gorras') {
      // For gorras: overrides already attempted above (case-insensitive),
      // otherwise use the single default for all gorras.
      price = price || ((data.gorras && data.gorras.default) || data.defaults.gorras);
    }
  }

  if (!price) return;

  // Update DOM: hidden input and display
  const input = document.getElementById('precio-producto');
  if (input) input.value = price;

  const precioElems = document.getElementsByClassName('precio-numero');
  const fmt = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  for (const el of precioElems) {
    el.textContent = `$${fmt(price)}`;
  }
}

// Run after DOMContentLoaded to ensure nodes exist
document.addEventListener('DOMContentLoaded', () => {
  applyPricesFromConfig();
});

/* ============================================ */
/* FUNCIONES EXISTENTES OPTIMIZADAS */
/* ============================================ */

// Función original mejorada para compatibilidad
function incluirHTML(id, archivo) {
    loadComponent(id, archivo, () => {
        if (archivo.includes("modalBootstrap.html")) {
            configurarModalCarrito();
        }
    });
}

function configurarModalCarrito() {
    const modalCarrito = document.getElementById('modalCarrito');
    if (modalCarrito) {
      modalCarrito.addEventListener('show.bs.modal', function () {
        // Mostrar contenido del carrito cuando se abre el modal
        if (typeof mostrarCarritoEnModal === 'function') {
          mostrarCarritoEnModal();
        }
      });
    }
    
    // Configurar el botón de confirmar eliminación
    const btnConfirmarEliminar = document.getElementById('confirmar-eliminar');
    if (btnConfirmarEliminar) {
      btnConfirmarEliminar.addEventListener('click', confirmarEliminacion);
    }

    // Configurar el botón de vaciar carrito
    const btnVaciarCarrito = document.getElementById('btn-vaciar-carrito');
    if (btnVaciarCarrito) {
      btnVaciarCarrito.addEventListener('click', function() {
        // Verificar si hay productos en el carrito
        const carrito = obtenerCarrito();
        if (carrito.length === 0) {
          mostrarNotificacion("El carrito ya está vacío", "error");
          return;
        }
        
        // Mostrar modal de confirmación
        const modalVaciar = new bootstrap.Modal(document.getElementById('modalVaciarCarrito'));
        modalVaciar.show();
      });
    }

    // Configurar el botón de confirmar vaciado
    const btnConfirmarVaciar = document.getElementById('confirmar-vaciar-carrito');
    if (btnConfirmarVaciar) {
      btnConfirmarVaciar.addEventListener('click', function() {
        // Vaciar el carrito
        vaciarCarrito();
        
        // Cerrar el modal de confirmación
        const modalVaciar = bootstrap.Modal.getInstance(document.getElementById('modalVaciarCarrito'));
        modalVaciar.hide();
        
        // Cerrar el modal del carrito también
        const modalCarrito = bootstrap.Modal.getInstance(document.getElementById('modalCarrito'));
        if (modalCarrito) {
          modalCarrito.hide();
        }
      });
    }
  }

  /* =================================== */
  /* FUNCIÓN DE NOTIFICACIÓN */
  /* =================================== */
  function mostrarNotificacion(mensaje, tipo = 'success') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification-bar ${tipo === 'error' ? 'error' : ''}`;
    notification.textContent = mensaje;
    
    // Agregar al body
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Ocultar y eliminar después de 3 segundos
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Hacer la función global para que sea accesible desde otros archivos
  window.mostrarNotificacion = mostrarNotificacion;
  /* =================================== */
  /* FIN FUNCIÓN DE NOTIFICACIÓN */
  /* =================================== */

  /* =================================== */
  /* FUNCIONES PARA CHECKOUT Y PEDIDOS */
  /* =================================== */

  // Función para obtener número de pedido GLOBAL desde el servidor
  async function obtenerNumeroPedido() {
    try {
      // Intentar obtener número desde el servidor (Edge Function)
      const response = await fetch('/api/numero-pedido', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return data.numeroPedido;
        } else {
          console.warn('Servidor retornó número de fallback:', data.numeroPedido);
          return data.numeroPedido;
        }
      } else {
        throw new Error(`Error HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Error obteniendo número de pedido del servidor:', error);
      
      // Fallback: generar número local basado en timestamp
      const timestamp = Date.now();
      const numeroFallback = `#L${timestamp.toString().slice(-6)}`;
      console.warn('Usando número de pedido local como fallback:', numeroFallback);
      return numeroFallback;
    }
  }

  // Función para vaciar el carrito
  function vaciarCarrito() {
    localStorage.removeItem('carritoMit');
    // Actualizar contador si existe
    const contador = document.getElementById('contador-carrito');
    if (contador) contador.textContent = '0';
    
    // Actualizar modal si está abierto
    if (typeof window.mostrarCarritoEnModal === 'function') {
      window.mostrarCarritoEnModal();
    }
  }

  // Función para generar resumen del pedido para email
  function generarResumenPedido(carrito, numeroPedido) {
    let resumen = `¡Gracias por confiar en MIT ESTAMPADOS! Recibimos tu pedido bajo el número: **${numeroPedido}**\n\n`;
    resumen += `Este es un resumen de tu pedido:\n\n`;
    
    let total = 0;
    let observaciones = [];
    let contadorObservaciones = 1;
    
    carrito.forEach((producto, index) => {
      const subtotal = parseInt(producto.precio) * parseInt(producto.cantidad);
      total += subtotal;
      
      let nombreProducto = producto.nombre;
      let superindice = '';
      
      // Verificar si el producto tiene modelo de estampa
      if (producto.colorEstampa && producto.colorEstampa.includes('modelo')) {
        const numeroModelo = producto.colorEstampa.replace('modelo', '');
        superindice = `⁽${contadorObservaciones}⁾`;
        nombreProducto += superindice;
        
        // Agregar observación
        observaciones.push(`${contadorObservaciones} - Modelo ${numeroModelo}`);
        contadorObservaciones++;
      }
      
      resumen += `${index + 1}. ${nombreProducto}\n`;
      resumen += `   - Talle: ${producto.talle}\n`;
      resumen += `   - Color: ${producto.colorRemera || producto.colorBuzo || ""}`;
      
      // Solo mostrar estampa si no es un modelo (para evitar duplicar la información)
      if (producto.colorEstampa && producto.colorEstampa !== 'Sin estampa' && !producto.colorEstampa.includes('modelo')) {
        resumen += ` - Estampa: ${producto.colorEstampa}`;
      }
      
      resumen += `\n   - Cantidad: ${producto.cantidad}\n`;
      resumen += `   - Precio unitario: $${producto.precio}\n`;
      resumen += `   - Subtotal: $${subtotal}\n\n`;
    });
    
    resumen += `TOTAL: $${total}\n\n`;
    
    // Agregar apartado de observaciones si hay alguna
    if (observaciones.length > 0) {
      resumen += `OBSERVACIONES:\n`;
      observaciones.forEach(obs => {
        resumen += `${obs}\n`;
      });
      resumen += `\n`;
    }
    
    resumen += `Pronto nos pondremos en contacto para confirmar el pedido.\n\n`;
    resumen += `¡Gracias por elegirnos!`;
    
    return resumen;
  }

  // Hacer funciones globales
  window.obtenerNumeroPedido = obtenerNumeroPedido;
  window.vaciarCarrito = vaciarCarrito;
  window.generarResumenPedido = generarResumenPedido;

  /* =================================== */
  /* FIN FUNCIONES CHECKOUT */
  /* =================================== */

  /* =================================== */
  /* FUNCIONES PARA MODAL DE ELIMINACIÓN */
  /* =================================== */

  let componentesProductoAEliminar = null;
  let componentesIndexAEliminar = null;
  let componentesContextoEliminacion = null;

  // Función para mostrar modal de confirmación de eliminación
  function mostrarModalEliminar(index, context) {
    const carrito = JSON.parse(localStorage.getItem('carritoMit')) || [];
    const producto = carrito[index];
    
    if (!producto) return;
    
    // Guardar datos para la eliminación
    componentesProductoAEliminar = producto;
    componentesIndexAEliminar = index;
    componentesContextoEliminacion = context;
    
    // Llenar información del producto en el modal
    const contenedor = document.getElementById('producto-eliminar');
    const subtotal = parseInt(producto.precio) * parseInt(producto.cantidad);
    
    contenedor.innerHTML = `
      <img src="${producto.imagen || '../imagenes/default.webp'}" 
           alt="${producto.nombre}" 
           style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
      <div class="text-start">
        <div class="fw-bold">${producto.nombre}</div>
        <div class="text-muted small">
          ${producto.talle} - ${producto.colorRemera || producto.colorBuzo || ""}${producto.colorEstampa ? ' - ' + producto.colorEstampa : ''}
        </div>
        <div class="text-warning">
          Cantidad: ${producto.cantidad} | Total: $${subtotal}
        </div>
      </div>
    `;
    
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('modalEliminar'));
    modal.show();
  }

  // Función para confirmar la eliminación
  function confirmarEliminacion() {
    if (componentesIndexAEliminar === null) return;
    
    const carrito = JSON.parse(localStorage.getItem('carritoMit')) || [];
    carrito.splice(componentesIndexAEliminar, 1);
    localStorage.setItem('carritoMit', JSON.stringify(carrito));
    
    // Actualizar interfaces
    if (typeof window.mostrarCarritoEnModal === 'function') {
      window.mostrarCarritoEnModal();
    }
    
    const contador = document.getElementById('contador-carrito');
    if (contador) {
      const total = carrito.reduce((acc, p) => acc + parseInt(p.cantidad), 0);
      contador.textContent = total;
    }
    
    // Mostrar notificación
    if (typeof window.mostrarNotificacion === 'function') {
      window.mostrarNotificacion("Producto eliminado del carrito");
    }
    
    // Actualizar checkout si estamos ahí
    if (document.getElementById("resumen-carrito") && typeof mostrarResumenCheckout === 'function') {
      mostrarResumenCheckout();
    }
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalEliminar'));
    if (modal) modal.hide();
    
    // Limpiar variables
    componentesProductoAEliminar = null;
    componentesIndexAEliminar = null;
    componentesContextoEliminacion = null;
  }

  // Hacer funciones globales
  window.mostrarModalEliminar = mostrarModalEliminar;
  window.confirmarEliminacion = confirmarEliminacion;
  window.obtenerNumeroPedido = obtenerNumeroPedido;
  window.generarResumenPedido = generarResumenPedido;
  window.vaciarCarrito = vaciarCarrito;

  /* =================================== */
  /* FIN FUNCIONES MODAL ELIMINACIÓN */
  /* =================================== */

  document.addEventListener("DOMContentLoaded", () => {
    // Si hay un contenedor para modales externos, cargar el archivo
    const modalContainer = document.getElementById("modal-container");
    if (modalContainer) {
      incluirHTML("modal-container", "../../componentes/modalBootstrap.html");
      incluirHTML("modal-talles-container", "../../componentes/modalBootstrap.html");
      incluirHTML("modal-eliminar-container", "../../componentes/modalBootstrap.html");
      incluirHTML("modal-vaciar-container", "../../componentes/modalBootstrap.html");
      incluirHTML("modal-carrito-container", "../../componentes/modalBootstrap.html");
    } else {
      // Si los modales ya están en el DOM (como en index.html), configurarlos directamente
      configurarModalCarrito();
    }
  });