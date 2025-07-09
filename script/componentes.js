function incluirHTML(id, archivo) {
    fetch(archivo)
      .then(res => res.text())
      .then(html => {
        document.getElementById(id).innerHTML = html;
        // Después de cargar el modal, agregar el event listener
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
    carrito.forEach((producto, index) => {
      const subtotal = parseInt(producto.precio) * parseInt(producto.cantidad);
      total += subtotal;
      
      resumen += `${index + 1}. ${producto.nombre}\n`;
      resumen += `   - Talle: ${producto.talle}\n`;
      resumen += `   - Color: ${producto.colorBuzo}`;
      if (producto.colorEstampa && producto.colorEstampa !== 'Sin estampa') {
        resumen += ` - Estampa: ${producto.colorEstampa}`;
      }
      resumen += `\n   - Cantidad: ${producto.cantidad}\n`;
      resumen += `   - Precio unitario: $${producto.precio}\n`;
      resumen += `   - Subtotal: $${subtotal}\n\n`;
    });
    
    resumen += `TOTAL: $${total}\n\n`;
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
          ${producto.talle} - ${producto.colorBuzo}${producto.colorEstampa ? ' - ' + producto.colorEstampa : ''}
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
      incluirHTML("modal-container", "../componentes/modalBootstrap.html");
    } else {
      // Si los modales ya están en el DOM (como en index.html), configurarlos directamente
      configurarModalCarrito();
    }
  });