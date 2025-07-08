let button = document.getElementById("myButton");
let isBlack = true; // Modo oscuro por defecto

// Transiciones suaves para todos los elementos que cambian color
const smoothElements = [
  document.body,
  document.querySelector("header"),
  document.querySelector("footer"),
  document.querySelector(".navbar"),
  ...document.querySelectorAll(".card")
];

smoothElements.forEach(el => {
  el.style.transition = "background-color 0.5s ease, color 0.5s ease";
});

// Función para aplicar el tema según el estado de isBlack
function aplicarModo() {
  if (isBlack) {
    // Modo oscuro
    document.body.style.background = "black";
    document.body.style.color = "#ccc";
    button.innerHTML = '<i class="bi bi-sun-fill"></i>';
    button.classList.remove("btn-light");
    button.classList.add("btn-dark");

    document.querySelectorAll(".card").forEach((card) => {
      card.style.backgroundColor = "#1e1e1e";
      card.style.color = "#ccc";
    });

    document.querySelectorAll(".btn-ver-mas").forEach((btn) => {
      btn.classList.remove("btn-outline-primary");
      btn.classList.add("btn-outline-light");
    });

    document.querySelector("header").style.backgroundColor = "#222";
    document.querySelector("footer").style.backgroundColor = "#222";
    document.querySelector("footer").style.color = "#ccc";

    document.querySelector(".navbar").classList.remove("bg-primary");
    document.querySelector(".navbar").classList.add("bg-dark");

  } else {
    // Modo claro
    document.body.style.background = "#ccc";
    document.body.style.color = "black";
    button.innerHTML = '<i class="bi bi-moon-fill"></i>';
    button.classList.remove("btn-dark");
    button.classList.add("btn-light");

    document.querySelectorAll(".card").forEach((card) => {
      card.style.backgroundColor = "white";
      card.style.color = "black";
    });

    document.querySelectorAll(".btn-ver-mas").forEach((btn) => {
      btn.classList.remove("btn-outline-light");
      btn.classList.add("btn-outline-primary");
    });

    document.querySelector("header").style.backgroundColor = "#007bff";
    document.querySelector("footer").style.backgroundColor = "#007bff";
    document.querySelector("footer").style.color = "white";

    document.querySelector(".navbar").classList.remove("bg-dark");
    document.querySelector(".navbar").classList.add("bg-primary");
  }
}

// Cambiar modo al hacer clic
button.addEventListener("click", function () {
  isBlack = !isBlack;
  aplicarModo();
});

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", aplicarModo);

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
