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
  }

  /* =================================== */
  /* FUNCIÓN DE NOTIFICACIÓN - AGREGAR ESTA FUNCIÓN A TODOS LOS PRODUCTOS */
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

  // Función para obtener y generar número de pedido
  function obtenerNumeroPedido() {
    const ultimoNumero = localStorage.getItem('ultimoNumeroPedido') || '0000';
    const nuevoNumero = (parseInt(ultimoNumero) + 1).toString().padStart(4, '0');
    localStorage.setItem('ultimoNumeroPedido', nuevoNumero);
    return `#${nuevoNumero}`;
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

  document.addEventListener("DOMContentLoaded", () => {
    incluirHTML("modal-container", "../componentes/modalBootstrap.html");
  });