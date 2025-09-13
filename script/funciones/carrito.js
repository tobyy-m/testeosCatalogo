const carritoKey = "carritoMit";

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem(carritoKey)) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem(carritoKey, JSON.stringify(carrito));
  actualizarContador();
}

function agregarAlCarrito(producto) {
  const carrito = obtenerCarrito();
  
  let existente;
  if (producto.colorRemera) {
    // Es una remera (incluyendo remera Lali)
    existente = carrito.find(p =>
      p.nombre === producto.nombre &&
      p.colorRemera === producto.colorRemera &&
      p.colorEstampa === producto.colorEstampa &&
      p.talle === producto.talle
    );
  } else if (producto.colorGorra) {
    // Es una gorra
    existente = carrito.find(p =>
      p.nombre === producto.nombre &&
      p.colorGorra === producto.colorGorra &&
      p.colorEstampa === producto.colorEstampa &&
      p.talle === producto.talle
    );
  } else if (producto.nombre.toLowerCase().includes('buzo lali')) {
    // Es buzo Lali (color de buzo + modelo + talle)
    existente = carrito.find(p =>
      p.nombre === producto.nombre &&
      p.colorBuzo === producto.colorBuzo &&
      p.colorEstampa === producto.colorEstampa &&
      p.talle === producto.talle
    );
  } else {
    // Es un buzo normal
    existente = carrito.find(p =>
      p.nombre === producto.nombre &&
      p.colorBuzo === producto.colorBuzo &&
      p.colorEstampa === producto.colorEstampa &&
      p.talle === producto.talle
    );
  }
  
  if (existente) {
    existente.cantidad = parseInt(existente.cantidad) + parseInt(producto.cantidad);
  } else {
    carrito.push(producto);
  }
  guardarCarrito(carrito);
  mostrarCarritoEnModal();
  
  // Usar notificación en lugar del alert
  if (typeof window.mostrarNotificacion === 'function') {
    window.mostrarNotificacion("¡Producto agregado al carrito con éxito!");
  } else {
    alert("Producto agregado al carrito"); // Fallback si no está disponible
  }
}

function eliminarProducto(index) {
  const carrito = obtenerCarrito();
  carrito.splice(index, 1);
  guardarCarrito(carrito);
  mostrarCarritoEnModal();
  if (document.getElementById("resumen-carrito")) {
    mostrarResumenCheckout();
  }
}

function vaciarCarrito() {
  localStorage.removeItem(carritoKey);
  actualizarContador();
  mostrarCarritoEnModal();
  if (document.getElementById("resumen-carrito")) {
    mostrarResumenCheckout();
  }
  
  // Mostrar notificación
  if (typeof window.mostrarNotificacion === 'function') {
    window.mostrarNotificacion("Carrito vaciado correctamente", "success");
  }
}

function modificarCantidad(index, cambio) {
  const carrito = obtenerCarrito();
  carrito[index].cantidad += cambio;
  if (carrito[index].cantidad < 1) carrito[index].cantidad = 1;
  guardarCarrito(carrito);
  mostrarCarritoEnModal();
  if (document.getElementById("resumen-carrito")) {
    mostrarResumenCheckout();
  }
}

function actualizarContador() {
  const carrito = obtenerCarrito();
  const total = carrito.reduce((acc, p) => acc + parseInt(p.cantidad), 0);
  const span = document.getElementById("contador-carrito");
  if (span) span.textContent = total;
}

function abrirCarritoModal() {
  document.getElementById("modal-carrito").classList.add("mostrar");
  mostrarCarritoEnModal();
}

function cerrarCarritoModal() {
  document.getElementById("modal-carrito").classList.remove("mostrar");
}

function mostrarCarritoEnModal() {
  const carrito = obtenerCarrito();
  const contenedor = document.getElementById("carrito-contenido");
  const totalDiv = document.getElementById("carrito-total");
  const btnVaciar = document.getElementById("btn-vaciar-carrito");
  
  contenedor.innerHTML = "";
  let total = 0;

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
    totalDiv.innerHTML = "";
    // Ocultar botón de vaciar carrito si está vacío
    if (btnVaciar) btnVaciar.style.display = 'none';
    return;
  }

  // Mostrar botón de vaciar carrito si hay productos
  if (btnVaciar) btnVaciar.style.display = 'block';

  carrito.forEach((p, i) => {
    const precio = parseInt(p.precio || 0);
    const subtotal = precio * parseInt(p.cantidad);
    total += subtotal;

    // Determinar el nombre del producto (ya viene formateado desde agregarCarrito.js)
    let nombreProducto = p.nombre;

    // Determinar los detalles del producto
    const colorPrenda = p.colorRemera || p.colorBuzo || p.colorGorra || "";
    let detalles = `${p.talle} - ${colorPrenda}`;
    // Solo mostrar estampa si no es un modelo (para evitar duplicar la información)
    if (p.colorEstampa && p.colorEstampa !== 'Sin estampa' && !p.colorEstampa.includes('modelo')) {
      detalles += ` - ${p.colorEstampa}`;
    }

    contenedor.innerHTML += `
      <div class="order-item">
        <img src="${p.imagen || 'imagenes/default.webp'}" alt="${nombreProducto}">
        <div class="quantity-controls">
          <button class="quantity-btn" onclick="modificarCantidadModal(${i}, -1)" ${p.cantidad <= 1 ? 'disabled' : ''}>-</button>
          <span class="quantity-number">${p.cantidad}</span>
          <button class="quantity-btn" onclick="modificarCantidadModal(${i}, 1)">+</button>
          <button class="remove-btn btn btn-danger btn-sm" onclick="mostrarModalEliminar(${i}, 'modal')" title="Eliminar producto">×</button>
        </div>
        <div class="item-info">
          <div class="item-name">${nombreProducto}</div>
          <div class="item-details">${detalles}</div>
        </div>
        <span class="price">$${subtotal}</span>
      </div>`;
  });

  totalDiv.innerHTML = `<div class="total">Total: $${total}</div>`;
}

// Función específica para mostrar el resumen en checkout
function mostrarResumenCheckout() {
  const carrito = obtenerCarrito();
  const contenedor = document.getElementById("resumen-carrito");
  const productosInput = document.getElementById("productos-input");

  if (!contenedor) return;

  contenedor.innerHTML = "";
  let total = 0;

  if (carrito.length === 0) {
    contenedor.innerHTML = '<p>Tu carrito está vacío. <a href="index.html">Volver a comprar</a></p>';
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
          <button class="quantity-btn" onclick="modificarCantidadCheckout(${i}, -1)" ${p.cantidad <= 1 ? 'disabled' : ''}>-</button>
          <span class="quantity-number">${p.cantidad}</span>
          <button class="quantity-btn" onclick="modificarCantidadCheckout(${i}, 1)">+</button>
          <button class="remove-btn btn btn-danger btn-sm" onclick="mostrarModalEliminar(${i}, 'checkout')" title="Eliminar producto">×</button>
        </div>
        <div class="item-info">
          <div class="item-name">${p.nombre}</div>
          <div class="item-details">${p.talle} - ${p.colorRemera || p.colorBuzo || p.colorGorra || ""}${p.colorEstampa ? ' - ' + p.colorEstampa : ''}</div>
        </div>
        <span class="price">$${subtotal}</span>
      </div>`;
  });

  contenedor.innerHTML += `<div class="total">Total: $${total}</div>`;

  // Preparar datos para el formulario
  if (productosInput) {
    const resumenProductos = carrito.map(p =>
      `${p.nombre} (${p.talle}, ${p.colorRemera || p.colorBuzo || p.colorGorra || ""}${p.colorEstampa ? ', ' + p.colorEstampa : ''}) x${p.cantidad} - $${parseInt(p.precio || 0) * parseInt(p.cantidad)}`
    ).join('; ');
    productosInput.value = `${resumenProductos}. TOTAL: $${total}`;
  }
}

// Función para animar el botón de envío
function animarBotonEnvio() {
  const btn = document.querySelector('.confirm-btn');
  const spinner = btn.querySelector('.btn-spinner');
  const originalText = btn.innerHTML;

  btn.disabled = true;
  btn.classList.add('loading');
  spinner.classList.remove('d-none');

  // Simular proceso de envío
  setTimeout(() => {
    btn.disabled = false;
    btn.classList.remove('loading');
    spinner.classList.add('d-none');
    btn.innerHTML = originalText;
  }, 3000);
}

// Funciones específicas para modificar cantidad en checkout
function modificarCantidadCheckout(index, cambio) {
  const carrito = obtenerCarrito();
  carrito[index].cantidad += cambio;
  if (carrito[index].cantidad < 1) carrito[index].cantidad = 1;
  guardarCarrito(carrito);
  mostrarResumenCheckout(); // Actualizar solo el resumen
}

// Funciones específicas para el modal
function modificarCantidadModal(index, cambio) {
  const carrito = obtenerCarrito();
  carrito[index].cantidad += cambio;
  if (carrito[index].cantidad < 1) carrito[index].cantidad = 1;
  guardarCarrito(carrito);
  mostrarCarritoEnModal();
  if (document.getElementById("resumen-carrito")) {
    mostrarResumenCheckout();
  }
}

// Event listeners consolidados
document.addEventListener("DOMContentLoaded", function () {
  actualizarContador();
  mostrarResumenCheckout();
  aplicarTemaCheckout();

  // Formulario de checkout
  const form = document.querySelector('form[name="pedido"]');
  if (form) {
    form.addEventListener('submit', function (e) {
      const carrito = obtenerCarrito();
      if (carrito.length === 0) {
        e.preventDefault();
        alert('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
        return;
      }
      animarBotonEnvio();
    });
  }

  // Validación en tiempo real
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

  // Botón de tema
  const themeButton = document.getElementById("myButton");
  if (themeButton) {
    themeButton.addEventListener("click", function () {
      setTimeout(aplicarTemaCheckout, 100);
    });
  }

  // Modal del carrito
  const modalCarrito = document.getElementById('modalCarrito');
  if (modalCarrito) {
    modalCarrito.addEventListener('show.bs.modal', function () {
      mostrarCarritoEnModal();
    });
  }
});

// Función para aplicar tema en checkout
function aplicarTemaCheckout() {
  // Verificar si el tema oscuro está activo
  const isBodyDark = document.body.style.background === "black" ||
    document.body.style.backgroundColor === "black";
}

// Hacer funciones globales
window.modificarCantidadModal = modificarCantidadModal;
window.modificarCantidadCheckout = modificarCantidadCheckout;
window.mostrarCarritoEnModal = mostrarCarritoEnModal;
window.mostrarResumenCheckout = mostrarResumenCheckout;
