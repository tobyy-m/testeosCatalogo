let button = document.getElementById("myButton");
let isBlack = localStorage.getItem('theme') === 'dark'; // Leer del localStorage

// Función para aplicar el tema según el estado de isBlack
function aplicarModo() {
  if (isBlack) {
    // Modo oscuro
    document.body.classList.add('dark');
    document.body.style.background = "#000000ff";
    document.body.style.color = "#ffffff";
    
    if (button) {
      button.innerHTML = '<i class="bi bi-sun-fill"></i>';
      button.classList.remove("btn-light");
      button.classList.add("btn-dark");
    }

    // Las tarjetas ahora tendrán el mismo fondo que el body (#212529)
    document.querySelectorAll(".card").forEach((card) => {
      card.style.backgroundColor = "#26292cff";
      card.style.color = "#ffffffff";
      card.style.borderColor = "#000000ff";
    });

    document.querySelectorAll(".btn-ver-mas").forEach((btn) => {
      btn.classList.remove("btn-outline-primary", "btn-outline-success", "btn-outline-warning", "btn-outline-info");
      btn.classList.add("btn-outline-light");
    });

    // Header y footer con color gris oscuro (#343a40)
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    const navbar = document.querySelector(".navbar");
    
    if (header) header.style.backgroundColor = "#000000ff";
    if (footer) {
      footer.style.backgroundColor = "#000000ff";
      footer.style.color = "#ffffff";
    }
    if (navbar) {
      navbar.classList.remove("bg-primary");
      navbar.classList.add("bg-dark");
    }

  } else {
    // Modo claro
    document.body.classList.remove('dark');
    document.body.style.background = "";
    document.body.style.color = "";
    
    if (button) {
      button.innerHTML = '<i class="bi bi-moon-fill"></i>';
      button.classList.remove("btn-dark");
      button.classList.add("btn-light");
    }

    document.querySelectorAll(".card").forEach((card) => {
      card.style.backgroundColor = "";
      card.style.color = "";
      card.style.borderColor = "";
    });

    document.querySelectorAll(".btn-ver-mas").forEach((btn) => {
      btn.classList.remove("btn-outline-light");
      // Restaurar colores originales según el contexto
      if (btn.textContent.includes("Buzo")) {
        btn.classList.add("btn-outline-primary");
      } else if (btn.textContent.includes("Remera")) {
        btn.classList.add("btn-outline-success");
      } else if (btn.textContent.includes("Taza")) {
        btn.classList.add("btn-outline-warning");
      } else {
        btn.classList.add("btn-outline-info");
      }
    });

    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    const navbar = document.querySelector(".navbar");
    
    if (header) header.style.backgroundColor = "";
    if (footer) {
      footer.style.backgroundColor = "";
      footer.style.color = "";
    }
    if (navbar) {
      navbar.classList.remove("bg-dark");
      navbar.classList.add("bg-primary");
    }
  }
  
  // Guardar en localStorage
  localStorage.setItem('theme', isBlack ? 'dark' : 'light');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  button = document.getElementById("myButton");
  
  if (button) {
    // Aplicar modo inicial
    aplicarModo();
    
    // Agregar event listener para cambiar modo
    button.addEventListener("click", function () {
      isBlack = !isBlack;
      aplicarModo();
    });
  }
});

    document.querySelectorAll(".card").forEach((card) => {
      card.style.backgroundColor = "white";
      card.style.color = "black";
    });

    document.querySelectorAll(".btn-ver-mas").forEach((btn) => {
      btn.classList.remove("btn-outline-light");
      btn.classList.add("btn-outline-primary");
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
