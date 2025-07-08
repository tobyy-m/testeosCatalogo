const colorBuzo = document.getElementById("colorBuzo");
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

// Eventos
colorBuzo.addEventListener("change", actualizarImagen);
document.addEventListener("DOMContentLoaded", () => {
  actualizarImagen();
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