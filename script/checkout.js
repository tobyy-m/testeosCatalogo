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
            
            // Enviar formulario vía Netlify Forms
            fetch('/', {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(new FormData(form)).toString()
            })
            .then(() => {
                // Mostrar modal de confirmación
                mostrarModalConfirmacion(numeroPedido, carrito);
                
                // Vaciar carrito
                if (typeof window.vaciarCarrito === 'function') {
                    window.vaciarCarrito();
                } else {
                    localStorage.removeItem('carritoMit');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                if (typeof window.mostrarNotificacion === 'function') {
                    window.mostrarNotificacion("Error al enviar el pedido", "error");
                } else {
                    alert("Error al enviar el pedido.");
                }
            })
            .finally(() => {
                btnSpinner.classList.add('d-none');
                submitBtn.disabled = false;
            });
        });
    }
});

// Función para mostrar modal de confirmación
function mostrarModalConfirmacion(numeroPedido, carrito) {
    // Actualizar número de pedido en el modal
    document.getElementById('numero-pedido-confirmacion').textContent = `${numeroPedido}`;
    
    // Configurar botón de descarga
    const btnDescargar = document.getElementById('descargar-comprobante');
    btnDescargar.onclick = () => generarPDF(numeroPedido, carrito);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
    modal.show();
}

// Función para generar PDF del comprobante
function generarPDF(numeroPedido, carrito) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configuración de colores
    const azulPrimario = [0, 123, 255];
    const grisTexto = [108, 117, 125];
    const verde = [40, 167, 69];
    
    // Header
    doc.setFillColor(...azulPrimario);
    doc.rect(0, 0, 210, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('MIT ESTAMPADOS', 20, 17);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Comprobante de Pedido', 140, 17);
    
    // Información del pedido
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(`Pedido ${numeroPedido}`, 20, 40);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...grisTexto);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-AR')}`, 20, 48);
    doc.text(`Hora: ${new Date().toLocaleTimeString('es-AR')}`, 20, 54);
    
    // Datos del cliente (si están disponibles)
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    
    if (nombre) {
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Datos del Cliente:', 20, 70);
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(...grisTexto);
        doc.text(`Nombre: ${nombre} ${document.getElementById('apellido').value || ''}`, 20, 78);
        doc.text(`Email: ${email}`, 20, 84);
        doc.text(`Teléfono: ${telefono}`, 20, 90);
        
        const calle = document.getElementById('calle').value;
        const numero = document.getElementById('numero').value;
        const localidad = document.getElementById('localidad').value;
        const metodoPago = document.getElementById('pago').value;
        
        if (calle) {
            doc.text(`Dirección: ${calle} ${numero}, ${localidad}`, 20, 96);
        }
        if (metodoPago) {
            const pagoTexto = metodoPago === 'efectivo' ? 'Efectivo' : 'Transferencia Bancaria';
            doc.text(`Método de Pago: ${pagoTexto}`, 20, 102);
        }
    }
    
    // Productos
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Detalle del Pedido:', 20, 120);
    
    let yPos = 130;
    let total = 0;
    
    // Encabezados de tabla
    doc.setFillColor(248, 249, 250);
    doc.rect(20, yPos - 5, 170, 8, 'F');
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Producto', 22, yPos);
    doc.text('Talle', 100, yPos);
    doc.text('Color', 120, yPos);
    doc.text('Cant.', 150, yPos);
    doc.text('Subtotal', 170, yPos);
    
    yPos += 10;
    
    // Productos
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    
    carrito.forEach((producto) => {
        const precio = parseInt(producto.precio || 0);
        const subtotal = precio * parseInt(producto.cantidad);
        total += subtotal;
        
        doc.setTextColor(...grisTexto);
        
        // Nombre del producto (truncar si es muy largo)
        const nombreCorto = producto.nombre.length > 25 ? 
            producto.nombre.substring(0, 22) + '...' : producto.nombre;
        doc.text(nombreCorto, 22, yPos);
        
        doc.text(producto.talle || '-', 100, yPos);
        doc.text(producto.colorBuzo || '-', 120, yPos);
        doc.text(producto.cantidad.toString(), 155, yPos);
        doc.text(`$${subtotal}`, 170, yPos);
        
        yPos += 6;
        
        // Nueva página si es necesario
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
    });
    
    // Total
    yPos += 5;
    doc.setFillColor(...verde);
    doc.rect(140, yPos - 3, 50, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`TOTAL: $${total}`, 145, yPos + 3);
    
    // Información adicional
    yPos += 20;
    doc.setTextColor(...grisTexto);
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    
    doc.text('INFORMACIÓN IMPORTANTE:', 20, yPos);
    yPos += 8;
    doc.text('• Este comprobante confirma la recepción de tu pedido', 20, yPos);
    yPos += 5;
    doc.text('• Pronto nos contactaremos contigo para coordinar entrega y pago', 20, yPos);
    yPos += 5;
    doc.text('• Conserva este comprobante para cualquier consulta', 20, yPos);
    yPos += 10;
    
    doc.text('Contacto: Instagram @mit.estampados', 20, yPos);
    yPos += 5;
    doc.text('¡Gracias por elegir MIT ESTAMPADOS!', 20, yPos);
    
    // Footer
    doc.setTextColor(...grisTexto);
    doc.setFontSize(7);
    doc.text(`Generado el ${new Date().toLocaleString('es-AR')}`, 20, 285);
    doc.text('MIT ESTAMPADOS © 2025', 150, 285);
    
    // Descargar el PDF
    doc.save(`MIT_ESTAMPADOS_Pedido_${numeroPedido}.pdf`);
}

// Funciones globales
window.mostrarModalEliminar = mostrarModalEliminar;
window.confirmarEliminacion = confirmarEliminacion;
window.actualizarResumenCheckout = actualizarResumenCheckout;
window.modificarCantidadEnCheckout = modificarCantidadEnCheckout;
window.mostrarModalConfirmacion = mostrarModalConfirmacion;
window.generarPDF = generarPDF;