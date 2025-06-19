const colorBuzo = document.getElementById("colorBuzo");
const colorEstampa = document.getElementById("colorEstampa");
const imgFront = document.getElementById("imgFront");
const imgBack = document.getElementById("imgBack");

function cargarImagen(imgElement, basePath, tipo) {
  const jpgPath = `${basePath}_${tipo}.jpg`;
  const jpegPath = `${basePath}_${tipo}.jpeg`;

  // Primero intenta con .jpg
  const testImg = new Image();
  testImg.onload = () => imgElement.src = jpgPath;
  testImg.onerror = () => imgElement.src = jpegPath;
  testImg.src = jpgPath;
}

function actualizarImagen() {
  const buzo = colorBuzo.value;
  const estampa = colorEstampa.value;
  const basePath = `../imagenes/marte_${buzo}_${estampa}`;
  cargarImagen(imgFront, basePath, "front");
  cargarImagen(imgBack, basePath, "back");
}

colorBuzo.addEventListener("change", actualizarImagen);
colorEstampa.addEventListener("change", actualizarImagen);

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", actualizarImagen);




// Modo claro/oscuro funcional
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
});
