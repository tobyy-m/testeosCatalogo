const colorBuzo = document.getElementById("colorBuzo");
const colorEstampa = document.getElementById("colorEstampa");
const imgFront = document.getElementById("imgFront");
const imgBack = document.getElementById("imgBack");

let imagenesPrecargadas = {};

// Precarga una imagen en caché
function precargarImagen(src) {
  if (imagenesPrecargadas[src]) return;
  const img = new Image();
  img.src = src;
  imagenesPrecargadas[src] = img;
}

// Cargar imagen con fallback .jpg → .jpeg
function cargarImagen(imgElement, basePath, tipo) {
  const jpg = `${basePath}_${tipo}.jpg`;
  const jpeg = `${basePath}_${tipo}.jpeg`;

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

// Actualiza las imágenes según selección
function actualizarImagen() {
  const buzo = colorBuzo.value;
  const estampa = colorEstampa.value;
  const basePath = `../imagenes/snipe/snipe_${buzo}_${estampa}`;
  cargarImagen(imgFront, basePath, "front");
  cargarImagen(imgBack, basePath, "back");
}

// Actualiza opciones del color de estampa
function actualizarOpcionesEstampa() {
  const buzo = colorBuzo.value;
  let opciones = ["rojo", "azul", "verde", "naranja", "celeste"];

  colorEstampa.innerHTML = "";
  opciones.forEach((color) => {
    const option = document.createElement("option");
    option.value = color;
    option.textContent = color.charAt(0).toUpperCase() + color.slice(1);
    colorEstampa.appendChild(option);
  });

  actualizarImagen(); // Cambiar imagen con la nueva estampa
}

// Eventos
colorBuzo.addEventListener("change", actualizarOpcionesEstampa);
colorEstampa.addEventListener("change", actualizarImagen);

document.addEventListener("DOMContentLoaded", () => {
  actualizarOpcionesEstampa();
});
