const colorBuzo = document.getElementById("colorBuzo");
const colorEstampa = document.getElementById("colorEstampa");
const colorBuzoSelector = document.getElementById("colorBuzoSelector");
const colorEstampaSelector = document.getElementById("colorEstampaSelector");
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
  const basePath = `../imagenes/marte/marte_${buzo}_${estampa}`;
  cargarImagen(imgFront, basePath, "front");
  cargarImagen(imgBack, basePath, "back");
}

// Actualiza opciones del color de estampa para selectores circulares
function actualizarOpcionesEstampa() {
  const buzo = colorBuzo.value;
  let opciones = ["rojo", "azul", "violeta"];

  // Si es blanco, agregar negro; si es negro, agregar blanco
  if (buzo === "blanco") opciones.unshift("negro");
  else if (buzo === "negro") opciones.unshift("blanco");

  // Habilitar/deshabilitar círculos de color de estampa
  const allEstampaOptions = colorEstampaSelector.querySelectorAll('.color-option');
  allEstampaOptions.forEach(option => {
    const colorValue = option.getAttribute('data-value');
    if (opciones.includes(colorValue)) {
      option.classList.remove('disabled');
    } else {
      option.classList.add('disabled');
      option.classList.remove('selected');
    }
  });

  // Seleccionar el primer color disponible si el actual no está disponible
  const currentEstampa = colorEstampa.value;
  if (!opciones.includes(currentEstampa)) {
    const firstAvailable = opciones[0];
    colorEstampa.value = firstAvailable;
    
    // Actualizar selección visual
    allEstampaOptions.forEach(option => option.classList.remove('selected'));
    const newSelected = colorEstampaSelector.querySelector(`[data-value="${firstAvailable}"]`);
    if (newSelected) newSelected.classList.add('selected');
  }

  actualizarImagen(); // Cambiar imagen con la nueva estampa
}

// Función para manejar clics en círculos de color
function setupColorSelectors() {
  // Selector de color de buzo
  colorBuzoSelector.addEventListener('click', (e) => {
    if (e.target.classList.contains('color-option') && !e.target.classList.contains('disabled')) {
      // Quitar selección anterior
      colorBuzoSelector.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
      // Agregar selección nueva
      e.target.classList.add('selected');
      // Actualizar input oculto
      colorBuzo.value = e.target.getAttribute('data-value');
      // Actualizar opciones de estampa
      actualizarOpcionesEstampa();
    }
  });

  // Selector de color de estampa
  colorEstampaSelector.addEventListener('click', (e) => {
    if (e.target.classList.contains('color-option') && !e.target.classList.contains('disabled')) {
      // Quitar selección anterior
      colorEstampaSelector.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
      // Agregar selección nueva
      e.target.classList.add('selected');
      // Actualizar input oculto
      colorEstampa.value = e.target.getAttribute('data-value');
      // Actualizar imagen
      actualizarImagen();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupColorSelectors();
  actualizarOpcionesEstampa();
});


// 🌗 Modo claro/oscuro funcional
const button = document.getElementById("myButton");
let isDark = true;

button?.addEventListener("click", () => {
  isDark = !isDark;

  document.body.classList.toggle("bg-light", !isDark);
  document.body.classList.toggle("text-dark", !isDark);
  document.body.classList.toggle("bg-dark", isDark);
  document.body.classList.toggle("text-light", isDark);

  const navbar = document.querySelector(".navbar");
  navbar?.classList.toggle("bg-primary", !isDark);
  navbar?.classList.toggle("bg-dark", isDark);

  const footer = document.querySelector("footer");
  footer?.classList.toggle("bg-dark", isDark);
  footer?.classList.toggle("bg-primary", !isDark);
  footer?.classList.toggle("text-light", isDark);
  footer?.classList.toggle("text-white", !isDark);

  const form = document.getElementById("formProducto");
  form?.classList.toggle("bg-light", !isDark);
  form?.classList.toggle("text-dark", !isDark);
  form?.classList.toggle("bg-dark", isDark);
  form?.classList.toggle("text-light", isDark);

  // Cambiar ícono
  button.innerHTML = isDark
    ? '<i class="bi bi-sun-fill"></i>'
    : '<i class="bi bi-moon-fill"></i>';
  button.classList.toggle("btn-dark", isDark);
  button.classList.toggle("btn-light", !isDark);
});
document.addEventListener("carrito-actualizado", function () {
    mostrarCarritoEnModal(); // refresca el modal
    actualizarContador();    // refresca el número rojo del carrito
});