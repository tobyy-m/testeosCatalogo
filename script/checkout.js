/* =================================== */
/* MANEJO DEL FORMULARIO DE CHECKOUT */
/* =================================== */

document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('form[name="pedido"]');
    
    if (form) {
        form.addEventListener('submit', function(e) {
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
            const numeroPedido = window.obtenerNumeroPedido();
            
            // Generar resumen completo
            const resumenCompleto = window.generarResumenPedido(carrito, numeroPedido);
            
            // Obtener email del usuario
            const emailUsuario = document.getElementById('email').value;
            
            // Llenar campos ocultos
            document.getElementById('numero-pedido-input').value = numeroPedido;
            document.getElementById('resumen-completo-input').value = resumenCompleto;
            document.getElementById('email-cliente-input').value = emailUsuario;
            
            // Preparar datos para el formulario (como antes)
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
                window.vaciarCarrito();
                
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
