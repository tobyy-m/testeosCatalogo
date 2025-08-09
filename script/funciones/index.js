// Unified theme controller with data-bs-theme attribute and CSS variables
let themeToggleBtn = document.getElementById('myButton');

function getStoredTheme() {
  return localStorage.getItem('theme') || 'light';
}

function storeTheme(theme) {
  localStorage.setItem('theme', theme);
}

function applyTheme(theme) {
  const root = document.documentElement; // <html>
  root.setAttribute('data-bs-theme', theme);

  // Update toggle button icon & style
  if (themeToggleBtn) {
    if (theme === 'dark') {
      themeToggleBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
      themeToggleBtn.classList.remove('btn-light');
      themeToggleBtn.classList.add('btn-dark');
    } else {
      themeToggleBtn.innerHTML = '<i class="bi bi-moon-fill"></i>';
      themeToggleBtn.classList.remove('btn-dark');
      themeToggleBtn.classList.add('btn-light');
    }
  }
}

function toggleTheme() {
  const current = getStoredTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  storeTheme(next);
  applyTheme(next);
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  themeToggleBtn = document.getElementById('myButton');
  applyTheme(getStoredTheme());
  themeToggleBtn?.addEventListener('click', toggleTheme);
});

/* =================================== */
/* FUNCIONES PARA MODAL DE ELIMINACIÓN EN INDEX */
/* =================================== */

let productoAEliminar = null;
let indexAEliminar = null;
let contextoEliminacion = null;

// Función para mostrar modal de confirmación de eliminación
function mostrarModalEliminar(index, context) {
  const carrito = JSON.parse(localStorage.getItem('carritoMit')) || [];
  const producto = carrito[index];
  
  if (!producto) return;
  
  // Guardar datos para la eliminación
  productoAEliminar = producto;
  indexAEliminar = index;
  contextoEliminacion = context;
  
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
  if (indexAEliminar === null) return;
  
  const carrito = JSON.parse(localStorage.getItem('carritoMit')) || [];
  carrito.splice(indexAEliminar, 1);
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
  
  // Mostrar notificación (si está disponible)
  if (typeof window.mostrarNotificacion === 'function') {
    window.mostrarNotificacion("Producto eliminado del carrito");
  }
  
  // Cerrar modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('modalEliminar'));
  if (modal) modal.hide();
  
  // Limpiar variables
  productoAEliminar = null;
  indexAEliminar = null;
  contextoEliminacion = null;
}

// Hacer funciones globales
window.mostrarModalEliminar = mostrarModalEliminar;
window.confirmarEliminacion = confirmarEliminacion;

// Event listener para el botón de confirmar eliminación
document.addEventListener("DOMContentLoaded", function() {
  const btnConfirmarEliminar = document.getElementById('confirmar-eliminar');
  if (btnConfirmarEliminar) {
    btnConfirmarEliminar.addEventListener('click', confirmarEliminacion);
  }
});

/* =================================== */
/* FIN FUNCIONES MODAL ELIMINACIÓN INDEX */
/* =================================== */

/* =================================== */
/* FUNCIÓN DE NOTIFICACIÓN PARA INDEX */
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

// Hacer la función global
window.mostrarNotificacion = mostrarNotificacion;

/* =================================== */
/* FIN FUNCIÓN DE NOTIFICACIÓN */
/* =================================== */
