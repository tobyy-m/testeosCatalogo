function agregarAlCarrito(producto) {
  const key = "carritoMit";
  const carrito = JSON.parse(localStorage.getItem(key)) || [];

  // Lista de productos que solo tienen variación de modelo
  const productosConSoloModelo = ['taza', 'buzo lali'];
  const esSoloModelo = productosConSoloModelo.some(tipo => 
    producto.nombre.toLowerCase().includes(tipo)
  );

  let existente;
  if (esSoloModelo) {
    if (producto.nombre.toLowerCase().includes("taza")) {
      // Para tazas: solo comparar nombre y modelo
      existente = carrito.find(p =>
        p.nombre === producto.nombre &&
        p.colorEstampa === producto.colorEstampa
      );
    } else {
      // Para buzo Lali: comparar nombre, modelo y talle (pero no color de buzo)
      existente = carrito.find(p =>
        p.nombre === producto.nombre &&
        p.colorEstampa === producto.colorEstampa &&
        p.talle === producto.talle
      );
    }
  } else {
    // Para otros productos (buzos normales): comparar todos los campos
    existente = carrito.find(p =>
      p.nombre === producto.nombre &&
      p.colorBuzo === producto.colorBuzo &&
      p.colorEstampa === producto.colorEstampa &&
      p.talle === producto.talle
    );
  }

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
    const nombreProducto = document.querySelector("h1")?.textContent.trim() || "Producto";
    const modelo = document.getElementById("colorEstampa")?.value || "";
    
    // Lista de productos que solo tienen variación de modelo (sin colores de buzo/prenda)
    const productosConSoloModelo = ['taza', 'buzo lali'];
    const esSoloModelo = productosConSoloModelo.some(producto => 
      nombreProducto.toLowerCase().includes(producto)
    );
    
    // Para productos con solo modelo, agregar el modelo al nombre
    let nombreCompleto = nombreProducto;
    if (esSoloModelo && modelo) {
      const numeroModelo = modelo.replace("modelo", "");
      nombreCompleto = `${nombreProducto} - Modelo ${numeroModelo}`;
    }
    
    const producto = {
      nombre: nombreCompleto,
      colorBuzo: document.getElementById("colorBuzo")?.value || "",
      colorEstampa: modelo || "Sin estampa",
      talle: document.getElementById("talle")?.value || document.getElementById("selector-talle")?.value || "",
      cantidad: parseInt(document.getElementById("cantidad")?.value) || 1,
      precio: parseInt(document.getElementById("precio-producto")?.value) || 0,
      imagen: document.getElementById("imgFront")?.src || document.getElementById("buzoLali")?.src || document.getElementById("tazaGato")?.src || ""
    };

    // Validación específica por tipo de producto
    if (nombreProducto.toLowerCase().includes("taza")) {
      // Para tazas: solo necesita modelo, cantidad y precio
      if (!modelo || !producto.cantidad || !producto.precio) {
        alert("Por favor completá todos los campos antes de agregar al carrito.");
        return;
      }
    } else if (nombreProducto.toLowerCase().includes("buzo lali")) {
      // Para buzo Lali: necesita modelo, talle, cantidad y precio (pero no color de buzo)
      if (!modelo || !producto.talle || !producto.cantidad || !producto.precio) {
        alert("Por favor completá todos los campos antes de agregar al carrito.");
        return;
      }
    } else {
      // Para otros productos (buzos normales): validar todos los campos
      if (!producto.talle || !producto.cantidad || !producto.precio) {
        alert("Por favor completá todos los campos antes de agregar al carrito.");
        return;
      }
    }

    agregarAlCarrito(producto);
  });
});
