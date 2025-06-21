const colorBuzo = document.getElementById("colorBuzo");
const colorEstampa = document.getElementById("colorEstampa");
const imgFront = document.getElementById("imgFront");
const imgBack = document.getElementById("imgBack");

let imagenesPrecargadas = {};

// Precarga una imagen
function precargarImagen(src) {
  if (imagenesPrecargadas[src]) return;
  const img = new Image();
  img.src = src;
  imagenesPrecargadas[src] = img;
}

// Cargar imagen con fallback .jpg → .jpeg
function cargarImagen(imgElement, basePath, tipo) {
  const jpg = `${basePath}_${tipo}.webp`;

  const testImg = new Image();
  testImg.onload = () => {
    imgElement.src = jpg;
    precargarImagen(jpg);
  };
  testImg.onerror = () => {
    imgElement.src = jpeg;
    precargarImagen(jpeg);
  };
  testImg.src = jpg;
}

// Actualiza las imágenes según la selección
function actualizarImagen() {
  const buzo = colorBuzo.value;
  const estampa = colorEstampa.value;
  const basePath = `../imagenes/love/love_${buzo}_${estampa}`;
  cargarImagen(imgFront, basePath, "front");
  cargarImagen(imgBack, basePath, "back");
}

// Actualiza las opciones del color de estampa
function actualizarOpcionesEstampa() {
  const buzo = colorBuzo.value;
  let opciones = ["naranja", "amarillo", "azul"];

  if (buzo === "negro") {
    opciones.push("blanco");
  } else if (buzo === "blanco") {
    opciones.push("negro", "morado");
  }

  colorEstampa.innerHTML = "";

  opciones.forEach((color) => {
    const option = document.createElement("option");
    option.value = color;
    option.textContent = color.charAt(0).toUpperCase() + color.slice(1);
    colorEstampa.appendChild(option);
  });

  actualizarImagen();
}

// Eventos
colorBuzo.addEventListener("change", actualizarOpcionesEstampa);
colorEstampa.addEventListener("change", actualizarImagen);

document.addEventListener("DOMContentLoaded", () => {
  actualizarOpcionesEstampa();
});
