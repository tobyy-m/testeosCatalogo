/* ─── Referencias al DOM ─────────────────────────────── */
const modeloEstampa = document.getElementById("colorEstampa");  // modelo1 | modelo2 | ... modelo7
const tazaImg       = document.getElementById("tazaCarpincho");      // única imagen
const modeloSelector = document.getElementById("modeloSelector");

/* ─── Caché de imágenes ───────────────────────────────── */
const cache = {};
const preload = src => {
  if (cache[src]) return;
  const im = new Image();
  im.src = src;
  cache[src] = im;
};

/* ─── Helper fade-in/out ──────────────────────────────── */
function fadeLoad(imgEl, url) {
  imgEl.classList.add("hidden");         // fade-out
  const probe = new Image();
  probe.onload = () => {
    imgEl.src = url;
    preload(url);
    setTimeout(() => imgEl.classList.remove("hidden"), 40); // fade-in
  };
  probe.src = url;
}

/* ─── Cargar la combinación elegida ───────────────────── */
function actualizarImagen() {
  const modelo = modeloEstampa.value;    // modelo1 / modelo2 / ... modelo7
  const url    = `../../imagenes/tazas/carpincho/tazaCarpincho_${modelo}.webp`;
  fadeLoad(tazaImg, url);
}

// Configurar selectores circulares de modelo
modeloSelector?.addEventListener("click", (e) => {
  const option = e.target.closest('.talle-option');
  if (!option) return;
  
  // Actualizar selección visual
  modeloSelector.querySelectorAll('.talle-option').forEach(opt => opt.classList.remove('selected'));
  option.classList.add('selected');
  
  // Actualizar valor del input hidden
  modeloEstampa.value = option.dataset.value;
  
  // Actualizar imagen
  actualizarImagen();
});

/* ─── Eventos ─────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", actualizarImagen);

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
