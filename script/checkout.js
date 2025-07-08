/* =================================== */
/* CHECKOUT.JS - FUNCIONES ESPECÍFICAS PARA CHECKOUT */
/* =================================== */

// ✅ Actualizar resumen del checkout (función específica para checkout)
function actualizarResumenCheckout() {
    console.log('Ejecutando actualizarResumenCheckout...');
    const carrito = JSON.parse(localStorage.getItem('carritoMit')) || [];
    const contenedor = document.getElementById("resumen-carrito");
    const productosInput = document.getElementById("productos-input");

    console.log('Carrito:', carrito);
    console.log('Contenedor:', contenedor);

    if (!contenedor) {
        console.error('No se encontró el contenedor resumen-carrito');
        return;
    }

    contenedor.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p>Tu carrito está vacío. <a href="index.html">Volver a comprar</a></p>';
        if (productosInput) productosInput.value = "";
        console.log('Carrito vacío, mostrando mensaje');
        return;
    }

    carrito.forEach((p, i) => {
        const precio = parseInt(p.precio || 0);
        const subtotal = precio * parseInt(p.cantidad);
        total += subtotal;

        contenedor.innerHTML += `
      <div class="order-item">
        <img src="${p.imagen || 'imagenes/default.webp'}" alt="${p.nombre}">
        <div class="quantity-controls">
          <button class="quantity-btn" onclick="modificarCantidadEnCheckout(${i}, -1)" ${p.cantidad <= 1 ? 'disabled' : ''}>-</button>
          <span class="quantity-number">${p.cantidad}</span>
          <button class="quantity-btn" onclick="modificarCantidadEnCheckout(${i}, 1)">+</button>
          <button class="remove-btn btn btn-danger btn-sm" onclick="mostrarModalEliminar(${i}, 'checkout')" title="Eliminar producto">×</button>
        </div>
        <div class="item-info">
          <div class="item-name">${p.nombre}</div>
          <div class="item-details">${p.talle} - ${p.colorBuzo}${p.colorEstampa ? ' - ' + p.colorEstampa : ''}</div>
        </div>
        <span class="price">$${subtotal}</span>
      </div>`;
    });

    contenedor.innerHTML += `<div class="total">Total: $${total}</div>`;

    console.log('Resumen actualizado, total:', total);

    // Preparar datos para el formulario
    if (productosInput) {
        const resumenProductos = carrito.map(p =>
            `${p.nombre} (${p.talle}, ${p.colorBuzo}${p.colorEstampa ? ', ' + p.colorEstampa : ''}) x${p.cantidad} - $${parseInt(p.precio || 0) * parseInt(p.cantidad)}`
        ).join('; ');
        productosInput.value = `${resumenProductos}. TOTAL: $${total}`;
    }
}

// ✅ Función local para modificar cantidad en checkout
function modificarCantidadEnCheckout(index, cambio) {
    const carrito = JSON.parse(localStorage.getItem('carritoMit')) || [];
    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad < 1) carrito[index].cantidad = 1;
    localStorage.setItem('carritoMit', JSON.stringify(carrito));
    
    // Actualizar contador
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        const total = carrito.reduce((acc, p) => acc + parseInt(p.cantidad), 0);
        contador.textContent = total;
    }
    
    // Actualizar resumen inmediatamente
    actualizarResumenCheckout();
}

/* =================================== */
/* FUNCIONES PARA MODAL DE ELIMINACIÓN EN CHECKOUT */
/* =================================== */

let checkoutProductoAEliminar = null;
let checkoutIndexAEliminar = null;
let checkoutContextoEliminacion = null;

// Función para mostrar modal de confirmación de eliminación
function mostrarModalEliminar(index, context) {
  const carrito = JSON.parse(localStorage.getItem('carritoMit')) || [];
  const producto = carrito[index];
  
  if (!producto) return;
  
  // Guardar datos para la eliminación
  checkoutProductoAEliminar = producto;
  checkoutIndexAEliminar = index;
  checkoutContextoEliminacion = context;
  
  // Llenar información del producto en el modal
  const contenedor = document.getElementById('producto-eliminar');
  const subtotal = parseInt(producto.precio) * parseInt(producto.cantidad);
  
  contenedor.innerHTML = `
    <img src="${producto.imagen || 'imagenes/default.webp'}" 
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
  if (checkoutIndexAEliminar === null) return;
  
  const carrito = JSON.parse(localStorage.getItem('carritoMit')) || [];
  carrito.splice(checkoutIndexAEliminar, 1);
  localStorage.setItem('carritoMit', JSON.stringify(carrito));
  
  // Actualizar contador
  const contador = document.getElementById('contador-carrito');
  if (contador) {
    const total = carrito.reduce((acc, p) => acc + parseInt(p.cantidad), 0);
    contador.textContent = total;
  }
  
  // FORZAR actualización del resumen del checkout inmediatamente
  console.log('Actualizando resumen del checkout...');
  actualizarResumenCheckout();
  
  // Actualizar modal del carrito si está disponible
  if (typeof window.mostrarCarritoEnModal === 'function') {
    window.mostrarCarritoEnModal();
  }
  
  // Mostrar notificación
  if (typeof window.mostrarNotificacion === 'function') {
    window.mostrarNotificacion("Producto eliminado del carrito");
  }
  
  // Cerrar modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('modalEliminar'));
  if (modal) modal.hide();
  
  // Limpiar variables
  checkoutProductoAEliminar = null;
  checkoutIndexAEliminar = null;
  checkoutContextoEliminacion = null;
}


/* =================================== */
/* INICIALIZACIÓN DEL CHECKOUT */
/* =================================== */

document.addEventListener("DOMContentLoaded", function() {
    // Configurar el botón de confirmar eliminación CON RETRASO para asegurar que el DOM esté listo
    setTimeout(() => {
        const btnConfirmarEliminar = document.getElementById('confirmar-eliminar');
        if (btnConfirmarEliminar) {
            // Remover cualquier listener previo
            btnConfirmarEliminar.removeEventListener('click', confirmarEliminacion);
            // Agregar el listener específico para checkout
            btnConfirmarEliminar.addEventListener('click', confirmarEliminacion);
            console.log('Event listener para eliminación configurado en checkout');
        }
    }, 100);
    
    // Inicializar el resumen del checkout
    actualizarResumenCheckout();
    
    // Validación de campos en tiempo real
    const inputs = document.querySelectorAll('.form-control, .form-select');
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            if (this.checkValidity()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            }
        });
    });

    // Configurar envío del formulario
    const form = document.querySelector('form[name="pedido"]');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevenir envío normal del formulario
            
            // Obtener carrito
            const carrito = JSON.parse(localStorage.getItem('carritoMit')) || [];
            
            if (carrito.length === 0) {
                if (typeof window.mostrarNotificacion === 'function') {
                    window.mostrarNotificacion("Tu carrito está vacío", "error");
                } else {
                    alert('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
                }
                return;
            }
            
            // Generar número de pedido
            const numeroPedido = window.obtenerNumeroPedido ? window.obtenerNumeroPedido() : Date.now();
            
            // Generar resumen completo
            const resumenCompleto = window.generarResumenPedido ? window.generarResumenPedido(carrito, numeroPedido) : `Pedido #${numeroPedido}`;
            
            // Obtener email del usuario
            const emailUsuario = document.getElementById('email').value;
            
            // Llenar campos ocultos
            document.getElementById('numero-pedido-input').value = numeroPedido;
            document.getElementById('resumen-completo-input').value = resumenCompleto;
            document.getElementById('email-cliente-input').value = emailUsuario;
            
            // Preparar datos para el formulario
            const total = carrito.reduce((acc, p) => acc + (parseInt(p.precio || 0) * parseInt(p.cantidad)), 0);
            const resumenProductos = carrito.map(p =>
                `${p.nombre} (${p.talle}, ${p.colorBuzo}${p.colorEstampa ? ', ' + p.colorEstampa : ''}) x${p.cantidad} - $${parseInt(p.precio || 0) * parseInt(p.cantidad)}`
            ).join('; ');
            document.getElementById('productos-input').value = `${resumenProductos}. TOTAL: $${total}`;
            
            // Mostrar botón de carga
            const submitBtn = form.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.bi-check-circle').parentNode;
            const btnSpinner = submitBtn.querySelector('.btn-spinner');
            
            btnText.style.display = 'none';
            btnSpinner.classList.remove('d-none');
            submitBtn.disabled = true;
            
            // Crear FormData para envío
            const formData = new FormData(form);
            
            // Enviar formulario usando fetch
            fetch('/', {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                // Éxito: vaciar carrito y mostrar mensaje
                if (typeof window.vaciarCarrito === 'function') {
                    window.vaciarCarrito();
                } else {
                    localStorage.removeItem('carritoMit');
                }
                
                if (typeof window.mostrarNotificacion === 'function') {
                    window.mostrarNotificacion("¡Compra realizada con éxito! - Revise su mail");
                } else {
                    alert("¡Compra realizada con éxito! - Revise su mail");
                }
                
                // Resetear formulario
                form.reset();
                
                // Redirigir después de 3 segundos
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            })
            .catch((error) => {
                console.error('Error:', error);
                
                if (typeof window.mostrarNotificacion === 'function') {
                    window.mostrarNotificacion("Error al procesar el pedido. Inténtalo nuevamente.", "error");
                } else {
                    alert("Error al procesar el pedido. Inténtalo nuevamente.");
                }
            })
            .finally(() => {
                // Restaurar botón
                btnText.style.display = '';
                btnSpinner.classList.add('d-none');
                submitBtn.disabled = false;
            });
        });
    }
});

// Hacer funciones globales específicas para checkout con OVERRIDE
window.mostrarModalEliminar = mostrarModalEliminar;
window.confirmarEliminacion = confirmarEliminacion;
window.actualizarResumenCheckout = actualizarResumenCheckout;
window.modificarCantidadEnCheckout = modificarCantidadEnCheckout;

// FORZAR override de funciones globales para checkout
if (window.location.pathname.includes('checkout')) {
    console.log('Página de checkout detectada, configurando funciones específicas');
    
    // Override función eliminar global si existe
    if (window.eliminarProducto) {
        window.eliminarProducto = function(index) {
            console.log('Override eliminarProducto llamado con index:', index);
            mostrarModalEliminar(index, 'checkout');
        };
    }
}