function agregarAlCarrito(producto) {
  const key = "carritoMit";
  const carrito = JSON.parse(localStorage.getItem(key)) || [];

  // Lista de productos que solo tienen variación de modelo
  const productosConSoloModelo = ['taza'];
  const esSoloModelo = productosConSoloModelo.some(tipo => 
    producto.nombre.toLowerCase().includes(tipo)
  );

  // Especial para buzo Lali: tiene modelo pero también necesita comparar talle
  const esBuzoLali = producto.nombre.toLowerCase().includes('buzo lali');

  let existente;
  if (esSoloModelo) {
    if (producto.nombre.toLowerCase().includes("taza")) {
      // Para tazas: comparar nombre y modelo (si existe)
      if (producto.colorEstampa && producto.colorEstampa !== "Sin estampa") {
        existente = carrito.find(p =>
          p.nombre === producto.nombre &&
          p.colorEstampa === producto.colorEstampa
        );
      } else {
        // Para tazas sin modelo, solo comparar por nombre
        existente = carrito.find(p =>
          p.nombre === producto.nombre &&
          (p.colorEstampa === producto.colorEstampa || (!p.colorEstampa && !producto.colorEstampa))
        );
      }
    }
  } else if (esBuzoLali) {
    // Para buzo Lali: comparar nombre, color de buzo, modelo y talle
    existente = carrito.find(p =>
      p.nombre === producto.nombre &&
      p.colorBuzo === producto.colorBuzo &&
      p.colorEstampa === producto.colorEstampa &&
      p.talle === producto.talle
    );
  } else {
    // Para otros productos: distinguir entre remeras, buzos y gorras
    if (producto.colorRemera) {
      // Es una remera: comparar nombre, colorRemera, colorEstampa y talle
      existente = carrito.find(p =>
        p.nombre === producto.nombre &&
        p.colorRemera === producto.colorRemera &&
        p.colorEstampa === producto.colorEstampa &&
        p.talle === producto.talle
      );
    } else if (producto.colorGorra) {
      // Es una gorra: comparar nombre, colorGorra, colorEstampa y talle
      existente = carrito.find(p =>
        p.nombre === producto.nombre &&
        p.colorGorra === producto.colorGorra &&
        p.colorEstampa === producto.colorEstampa &&
        p.talle === producto.talle
      );
    } else {
      // Es un buzo: comparar todos los campos (comportamiento original)
      existente = carrito.find(p =>
        p.nombre === producto.nombre &&
        p.colorBuzo === producto.colorBuzo &&
        p.colorEstampa === producto.colorEstampa &&
        p.talle === producto.talle
      );
    }
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
    const productosConSoloModelo = ['taza'];
    const esSoloModelo = productosConSoloModelo.some(producto => 
      nombreProducto.toLowerCase().includes(producto)
    );
    
    // Especial para buzo Lali: tiene modelo pero no color de buzo
    const esBuzoLali = nombreProducto.toLowerCase().includes('buzo lali');
    
    // Especial para remera Lali: tiene color de remera + modelo
    const esRemeraLali = nombreProducto.toLowerCase().includes('remera lali');
    
    // Especial para gorra Lali: tiene color de gorra + color de estampa
    const esGorraLali = nombreProducto.toLowerCase().includes('gorra lali') && 
                        !nombreProducto.toLowerCase().includes('payaso') && 
                        !nombreProducto.toLowerCase().includes('corona') && 
                        !nombreProducto.toLowerCase().includes('smile');
    
    // Gorras simples: solo color de gorra (Smile, Payaso, Corona, etc.)
    const esGorraSimple = nombreProducto.toLowerCase().includes('gorra') && !esGorraLali;
    
    // Para productos con solo modelo, agregar el modelo al nombre (si existe)
    let nombreCompleto = nombreProducto;
    if (esSoloModelo && modelo) {
      const numeroModelo = modelo.replace("modelo", "");
      nombreCompleto = `${nombreProducto} - Modelo ${numeroModelo}`;
    } else if (esBuzoLali && modelo) {
      const numeroModelo = modelo.replace("modelo", "");
      nombreCompleto = `${nombreProducto} - Modelo ${numeroModelo}`;
    } else if (esRemeraLali && modelo) {
      const numeroModelo = modelo.replace("modelo", "");
      nombreCompleto = `${nombreProducto} - Modelo ${numeroModelo}`;
    } else if (nombreProducto.toLowerCase().includes("taza") && !modelo) {
      // Si es una taza sin modelo, mantener el nombre original
      nombreCompleto = nombreProducto;
    }
    
    // Función para obtener la imagen principal del producto
    function obtenerImagenPrincipal() {
      // Lista de IDs comunes para imágenes principales
      const posiblesIds = ['imgFront', 'buzoLali', 'remeraLali', 'tazaGato', 'tazaCarpincho', 'imgGorra'];
      
      for (const id of posiblesIds) {
        const img = document.getElementById(id);
        if (img && img.src) {
          return img.src;
        }
      }
      
      // Si no encuentra por ID, buscar la primera imagen en el contenedor principal
      const mainContainer = document.querySelector('main');
      const primeraImg = mainContainer?.querySelector('img');
      return primeraImg?.src || "";
    }
    
    // Detectar el tipo de producto para usar los campos correctos
    const esRemera = nombreProducto.toLowerCase().includes("remera");
    const esBuzo = nombreProducto.toLowerCase().includes("buzo");
    const esGorra = nombreProducto.toLowerCase().includes("gorra");
    
    let colorPrenda = "";
    if (esRemera) {
      colorPrenda = document.getElementById("colorRemera")?.value || "";
    } else if (esBuzo) {
      colorPrenda = document.getElementById("colorBuzo")?.value || "";
    } else if (esGorra) {
      colorPrenda = document.getElementById("colorGorra")?.value || "";
    }

    const producto = {
      nombre: nombreCompleto,
      colorBuzo: esBuzo ? colorPrenda : "", // Solo para buzos
      colorRemera: esRemera ? colorPrenda : "", // Solo para remeras
      colorGorra: esGorra ? colorPrenda : "", // Solo para gorras
      colorEstampa: esGorraSimple ? "" : (modelo || "Sin estampa"), // Gorras simples no tienen estampa
      talle: document.getElementById("talle")?.value || document.getElementById("selector-talle")?.value || "",
      cantidad: parseInt(document.getElementById("cantidad")?.value) || 1,
      precio: parseInt(document.getElementById("precio-producto")?.value) || 0,
      imagen: obtenerImagenPrincipal()
    };

    // Validación específica por tipo de producto
    if (nombreProducto.toLowerCase().includes("taza")) {
      // Para tazas: cantidad y precio son obligatorios, modelo opcional
      if (!producto.cantidad || !producto.precio) {
        alert("Por favor completá todos los campos antes de agregar al carrito.");
        return;
      }
      // Si hay modelo, validarlo también
      if (document.getElementById("colorEstampa") && !modelo) {
        alert("Por favor seleccioná un modelo antes de agregar al carrito.");
        return;
      }
    } else if (nombreProducto.toLowerCase().includes("buzo lali")) {
      // Para buzo Lali: necesita modelo, talle, cantidad y precio (pero no color de buzo)
      if (!modelo || !producto.talle || !producto.cantidad || !producto.precio) {
        alert("Por favor completá todos los campos antes de agregar al carrito.");
        return;
      }
    } else if (nombreProducto.toLowerCase().includes("remera lali")) {
      // Para remera Lali: necesita color de remera, modelo, talle, cantidad y precio
      if (!colorPrenda || !modelo || !producto.talle || !producto.cantidad || !producto.precio) {
        alert("Por favor completá todos los campos antes de agregar al carrito.");
        return;
      }
    } else if (nombreProducto.toLowerCase().includes("gorra")) {
      // Para gorras: validación dependiendo del tipo
      if (esGorraLali) {
        // Gorra Lali necesita color de gorra, color de estampa, talle, cantidad y precio
        if (!colorPrenda || !modelo || !producto.talle || !producto.cantidad || !producto.precio) {
          alert("Por favor completá todos los campos antes de agregar al carrito.");
          return;
        }
      } else {
        // Gorras simples (Smile, Payaso, Corona) solo necesitan color de gorra, talle, cantidad y precio
        if (!colorPrenda || !producto.talle || !producto.cantidad || !producto.precio) {
          alert("Por favor completá todos los campos antes de agregar al carrito.");
          return;
        }
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
