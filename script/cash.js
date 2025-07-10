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

// Cargar imagen .jpg con fade
function cargarImagen(imgElement, basePath, tipo) {
  const jpg = `${basePath}_${tipo}.jpg`;

  imgElement.classList.add("hidden"); // comienza fade out

  const nuevaImg = new Image();
  nuevaImg.onload = () => {
    imgElement.src = jpg;
    precargarImagen(jpg);
    setTimeout(() => imgElement.classList.remove("hidden"), 50); // fade in
  };
  nuevaImg.src = jpg;
}

function actualizarImagen() {
  const buzo = colorBuzo.value;
  const basePath = `../imagenes/cash/cash_${buzo}`;
  cargarImagen(imgFront, basePath, "front");
  cargarImagen(imgBack, basePath, "back");
}

// Función para manejar clics en círculos de color
function setupColorSelectors() {
  if (!colorBuzoSelector) return;
  
  // Selector de color de buzo
  colorBuzoSelector.addEventListener('click', (e) => {
    if (e.target.classList.contains('color-option')) {
      // Quitar selección anterior
      colorBuzoSelector.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
      // Agregar selección nueva
      e.target.classList.add('selected');
      // Actualizar input oculto
      colorBuzo.value = e.target.getAttribute('data-value');
      // Actualizar imagen
      actualizarImagen();
    }
  });
}

// Función para manejar la selección de talles
function setupTalleSelector() {
  if (!talleSelector) return;
  
  talleSelector.addEventListener('click', (e) => {
    if (e.target.classList.contains('talle-option')) {
      // Quitar selección anterior
      talleSelector.querySelectorAll('.talle-option').forEach(opt => opt.classList.remove('selected'));
      // Agregar selección nueva
      e.target.classList.add('selected');
      // Actualizar input oculto y select original
      const talle = e.target.getAttribute('data-talle');
      if (talleInput) talleInput.value = talle;
      
      // Mantener sincronizado el select original para compatibilidad
      const selectTalle = document.getElementById('selector-talle');
      if (selectTalle) selectTalle.value = talle;
    }
  });
}

// Eventos
// Event listener comentado - ahora se maneja con selectores circulares
// colorBuzo.addEventListener("change", actualizarImagen);
document.addEventListener("DOMContentLoaded", () => {
  setupColorSelectors();
  setupTalleSelector();
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