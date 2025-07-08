/* =================================== */
/* CHECKOUT.JS - GESTIÓN DEL CHECKOUT */
/* =================================== */

// Variables específicas del checkout
let checkoutProductoAEliminar = null;
let checkoutIndexAEliminar = null;

// Actualizar resumen del checkout
function actualizarResumenCheckout() {
    const carrito = JSON.parse(localStorage.getItem('carritoMit')) || [];
    const contenedor = document.getElementById("resumen-carrito");
    const productosInput = document.getElementById("productos-input");

    if (!contenedor) return;

    contenedor.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p>Tu carrito está vacío. <a href="index.html">Volver a comprar</a></p>';
        if (productosInput) productosInput.value = "";
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
                    <button class="remove-btn btn btn-danger btn-sm" onclick="mostrarModalEliminar(${i})" title="Eliminar">×</button>
                </div>
                <div class="item-info">
                    <div class="item-name">${p.nombre}</div>
                    <div class="item-details">${p.talle} - ${p.colorBuzo}${p.colorEstampa ? ' - ' + p.colorEstampa : ''}</div>
                </div>
                <span class="price">$${subtotal}</span>
            </div>`;
    });

    contenedor.innerHTML += `<div class="total">Total: $${total}</div>`;

    if (productosInput) {
        const resumenProductos = carrito.map(p =>
            `${p.nombre} (${p.talle}, ${p.colorBuzo}${p.colorEstampa ? ', ' + p.colorEstampa : ''}) x${p.cantidad} - $${parseInt(p.precio || 0) * parseInt(p.cantidad)}`
        ).join('; ');
        productosInput.value = `${resumenProductos}. TOTAL: $${total}`;
    }
}

// Modificar cantidad en checkout
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
    
    actualizarResumenCheckout();
}

// Mostrar modal de eliminación
function mostrarModalEliminar(index) {
    const carrito = JSON.parse(localStorage.getItem('carritoMit')) || [];
    const producto = carrito[index];
    
    if (!producto) return;
    
    checkoutProductoAEliminar = producto;
    checkoutIndexAEliminar = index;
    
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
    
    const modal = new bootstrap.Modal(document.getElementById('modalEliminar'));
    modal.show();
}

// Confirmar eliminación
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
    
    checkoutProductoAEliminar = null;
    checkoutIndexAEliminar = null;
}

// Inicialización
document.addEventListener("DOMContentLoaded", function() {
    // Configurar botón de eliminación
    const btnConfirmarEliminar = document.getElementById('confirmar-eliminar');
    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener('click', confirmarEliminacion);
    }
    
    // Inicializar resumen
    actualizarResumenCheckout();
    
    // Validación de formulario
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

    // Envío del formulario
    const form = document.querySelector('form[name="pedido"]');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const carrito = JSON.parse(localStorage.getItem('carritoMit')) || [];
            
            if (carrito.length === 0) {
                if (typeof window.mostrarNotificacion === 'function') {
                    window.mostrarNotificacion("Tu carrito está vacío", "error");
                } else {
                    alert('Tu carrito está vacío.');
                }
                return;
            }
            
            // Generar número de pedido
            const numeroPedido = window.obtenerNumeroPedido();
            
            // Generar resumen
            const resumenCompleto = window.generarResumenPedido ? window.generarResumenPedido(carrito, numeroPedido) : `Pedido ${numeroPedido}`;
            
            // Llenar campos ocultos
            document.getElementById('numero-pedido-input').value = numeroPedido;
            document.getElementById('resumen-completo-input').value = resumenCompleto;
            document.getElementById('email-cliente-input').value = document.getElementById('email').value;
            
            // Botón de carga
            const submitBtn = form.querySelector('button[type="submit"]');
            const btnSpinner = submitBtn.querySelector('.btn-spinner');
            
            btnSpinner.classList.remove('d-none');
            submitBtn.disabled = true;
            
            // Enviar formulario
            const formData = new FormData(form);
            
            fetch('/', {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                // Enviar email de confirmación al cliente (ULTRA SEGURO)
                enviarEmailClienteSeguro(formData);
                
                // Vaciar carrito
                if (typeof window.vaciarCarrito === 'function') {
                    window.vaciarCarrito();
                } else {
                    localStorage.removeItem('carritoMit');
                }
                
                if (typeof window.mostrarNotificacion === 'function') {
                    window.mostrarNotificacion("¡Compra realizada con éxito! - El cliente recibirá un email de confirmación");
                } else {
                    alert("¡Compra realizada con éxito! El cliente recibirá un email de confirmación.");
                }
                
                form.reset();
                setTimeout(() => window.location.href = 'index.html', 3000);
            })
            .catch((error) => {
                console.error('Error:', error);
                if (typeof window.mostrarNotificacion === 'function') {
                    window.mostrarNotificacion("Error al procesar el pedido", "error");
                } else {
                    alert("Error al procesar el pedido.");
                }
            })
            .finally(() => {
                btnSpinner.classList.add('d-none');
                submitBtn.disabled = false;
            });
        });
    }
});

// Función ULTRA SEGURA para enviar email de confirmación AL CLIENTE
// FormSubmit: 100% gratis, sin límites, sin credenciales visibles
// SOLO envía confirmación al cliente (Netlify Forms ya guarda tu copia)
async function enviarEmailClienteSeguro(formData) {
    try {
        const datos = Object.fromEntries(formData);
        
        // Solo enviar confirmación al cliente (FormSubmit envía al email del cliente directamente)
        const response = await fetch(`https://formsubmit.co/ajax/${datos.email}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                // Email de confirmación directamente al cliente
                name: `MIT ESTAMPADOS`,
                email: 'noreply@mitestampados.com',
                subject: `🎉 Confirmación de Pedido #${datos.numeroPedido} - MIT ESTAMPADOS`,
                message: `Hola ${datos.nombre},

¡Gracias por tu compra en MIT ESTAMPADOS!

Tu pedido #${datos.numeroPedido} ha sido recibido exitosamente.

� RESUMEN DEL PEDIDO:
${datos.resumenCompleto}

📍 DIRECCIÓN DE ENTREGA:
${datos.calle} ${datos.numero}, ${datos.localidad}

💳 MÉTODO DE PAGO: ${datos.pago === 'efectivo' ? 'Efectivo' : 'Transferencia Bancaria'}

� PRÓXIMOS PASOS:
• Nos contactaremos en las próximas 24 horas
• Confirmaremos detalles de entrega y pago
• Te notificaremos cuando esté listo

¡Gracias por elegir MIT ESTAMPADOS!
Instagram: @mit.estampados

---
Este es un email automático de confirmación.`,
                
                // Configuración (SIN credenciales visibles)
                _template: 'table',
                _captcha: 'false'
            })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        console.log('✅ Email enviado exitosamente');
        return { success: true };

    } catch (error) {
        console.error('❌ Error enviando email:', error);
        // No mostrar error al usuario - el pedido ya se procesó
    }
}

// Funciones globales
window.mostrarModalEliminar = mostrarModalEliminar;
window.confirmarEliminacion = confirmarEliminacion;
window.actualizarResumenCheckout = actualizarResumenCheckout;
window.modificarCantidadEnCheckout = modificarCantidadEnCheckout;