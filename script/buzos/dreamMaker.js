const colorBuzo = document.getElementById("colorBuzo");
const colorBuzoSelector = document.getElementById("colorBuzoSelector");
const talleSelector = document.getElementById("talleSelector");
const talleInput = document.getElementById("talle");
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
  const basePath = `../../imagenes/buzos/dreamMaker/dreamMaker_${buzo}`;
  cargarImagen(imgFront, basePath, "front");
  cargarImagen(imgBack, basePath, "back");
  extraSegunColor();
}

function extraSegunColor() {
  const color = colorBuzo.value;
  let colores = ["rojo","negro","azulFrancia","azulMarino","naranja"];
  const extra = document.getElementById("extra");
  if (colores.includes(color)) {
    extra.textContent = "*El color final puede ser ligeramente diferente al de la imagen. Consultar Disponibilidad.";
  }
}

// Configurar selectores circulares de color
colorBuzoSelector?.addEventListener("click", (e) => {
  const option = e.target.closest('.color-option');
  if (!option) return;
  
  // Actualizar selección visual
  colorBuzoSelector.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
  option.classList.add('selected');
  
  // Actualizar valor del input hidden
  colorBuzo.value = option.dataset.value;
  
  // Actualizar imagen
  actualizarImagen();
});

// Configurar selectores circulares de talle
talleSelector?.addEventListener("click", (e) => {
  const option = e.target.closest('.talle-option');
  if (!option) return;
  
  // Actualizar selección visual
  talleSelector.querySelectorAll('.talle-option').forEach(opt => opt.classList.remove('selected'));
  option.classList.add('selected');
  
  // Actualizar valor del input hidden
  talleInput.value = option.dataset.talle;
});

document.addEventListener("DOMContentLoaded", () => {
  actualizarImagen();
});


// 🌗 Modo claro/oscuro funcional
const button = document.getElementById("myButton");
let isDark = true;

// Inicializar el icono correcto al cargar la página
if (button) {
  button.innerHTML = isDark
    ? '<i class="bi bi-sun-fill"></i>'
    : '<i class="bi bi-moon-fill"></i>';
  button.classList.toggle("btn-dark", isDark);
  button.classList.toggle("btn-light", !isDark);
}

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
