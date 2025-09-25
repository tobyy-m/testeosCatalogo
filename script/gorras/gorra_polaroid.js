const colorGorra = document.getElementById("colorGorra");
const colorEstampa = document.getElementById("colorEstampa");
const colorGorraSelector = document.getElementById("colorGorraSelector");
const colorEstampaSelector = document.getElementById("colorEstampaSelector");
const imgGorra = document.getElementById("imgGorra");

let imagenesPrecargadas = {};

function precargarImagen(src) {
    if (imagenesPrecargadas[src]) return;
    const img = new Image();
    img.src = src;
    imagenesPrecargadas[src] = img;
}

// Cargar imagen .webp con fade
function cargarImagen(imgElement, basePath, tipo) {
    const webp = tipo ? `${basePath}_${tipo}.webp` : `${basePath}.webp`;

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
    const gorra = colorGorra.value;
    const estampa = colorEstampa ? colorEstampa.value : "";
    const basePath = `../../imagenes/gorras/gorra_polaroid/gorra_polaroid_${gorra}`;
    cargarImagen(imgGorra, basePath, "");
}

const opcionesPorColorGorra = {
  "negro": [],
  "blanco": []
};

function actualizarOpcionesEstampa() {
    // No hay estampas, solo actualizar imagen
    actualizarImagen();
}

// Función para manejar clics en círculos de color
function setupColorSelectors() {
    // Selector de color de gorra
    colorGorraSelector.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-option') && !e.target.classList.contains('hidden')) {
            // Quitar selección anterior
            colorGorraSelector.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            // Agregar selección nueva
            e.target.classList.add('selected');
            // Actualizar input oculto
            colorGorra.value = e.target.getAttribute('data-value');
            // Actualizar opciones de estampa
            actualizarOpcionesEstampa();
        }
    });


}

document.addEventListener("DOMContentLoaded", () => {
    setupColorSelectors();

    actualizarImagen();
});

document.addEventListener("carrito-actualizado", function () {
    mostrarCarritoEnModal(); // refresca el modal
    actualizarContador();    // refresca el número rojo del carrito
});