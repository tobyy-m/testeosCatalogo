const colorBuzo = document.getElementById("colorBuzo");
const colorEstampa = document.getElementById("colorEstampa");
const imgFront = document.getElementById("imgFront");
const imgBack = document.getElementById("imgBack");

let imagenesPrecargadas = {};

function precargarImagen(src) {
  if (imagenesPrecargadas[src]) return;
  const img = new Image();
  img.src = src;
  imagenesPrecargadas[src] = img;
}

// Cargar imagen .webp con fade
function cargarImagen(imgElement, basePath, tipo) {
  const webp = `${basePath}_${tipo}.webp`;

  imgElement.classList.add("hidden"); // comienza fade out

  const nuevaImg = new Image();
  nuevaImg.onload = () => {
    imgElement.src = webp;
    precargarImagen(webp);
    setTimeout(() => imgElement.classList.remove("hidden"), 50); // fade in
  };
  nuevaImg.src = webp;
}

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
