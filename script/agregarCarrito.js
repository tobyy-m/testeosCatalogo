function agregarAlCarrito(producto) {
  const key = "carritoMit";
  const carrito = JSON.parse(localStorage.getItem(key)) || [];

  const existente = carrito.find(p =>
    p.nombre === producto.nombre &&
    p.colorBuzo === producto.colorBuzo &&
    p.colorEstampa === producto.colorEstampa &&
    p.talle === producto.talle
  );

  if (existente) {
    existente.cantidad += producto.cantidad;
  } else {
    carrito.push(producto);
  }

  localStorage.setItem(key, JSON.stringify(carrito));
  document.dispatchEvent(new Event("carrito-actualizado"));
  
  /* =================================== */
  /* NOTIFICACIÓN VERDE - YA APLICADO AQUÍ */
  /* =================================== */
  // Usar la nueva notificación en lugar del alert
  if (typeof window.mostrarNotificacion === 'function') {
    window.mostrarNotificacion("¡Producto agregado al carrito con éxito!");
  } else {
    alert("Producto agregado al carrito"); // Fallback si no está disponible
  }
  /* =================================== */
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-agregar-carrito");
  btn?.addEventListener("click", () => {
    const producto = {
      nombre: document.querySelector("h1")?.textContent.trim() || "Producto",
      colorBuzo: document.getElementById("colorBuzo")?.value || "",
      colorEstampa: document.getElementById("colorEstampa")?.value || "Sin estampa",
      talle: document.getElementById("talle")?.value || document.getElementById("selector-talle")?.value || "",
      cantidad: parseInt(document.getElementById("cantidad")?.value) || 1,
      precio: parseInt(document.getElementById("precio-producto")?.value) || 0,
      imagen: document.getElementById("imgFront")?.src || ""
    };

    if (!producto.talle || !producto.cantidad || !producto.precio) {
      alert("Por favor completá todos los campos antes de agregar al carrito.");
      return;
    }

    agregarAlCarrito(producto);
  });
});
