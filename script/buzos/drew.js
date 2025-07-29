const colorBuzo = document.getElementById("colorBuzo");
const colorEstampa = document.getElementById("colorEstampa");
const colorBuzoSelector = document.getElementById("colorBuzoSelector");
const colorEstampaSelector = document.getElementById("colorEstampaSelector");
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
    const estampa = colorEstampa ? colorEstampa.value : "";
    const basePath = `../../imagenes/buzos/drew/drew_${buzo}`;
    cargarImagen(imgFront, basePath, "front");
    cargarImagen(imgBack, basePath, "back");
}

const opcionesPorColorBuzo = {
  "negro": [],
  "blanco": [],
  "azulMarino": []
};

function actualizarOpcionesEstampa() {
    // No hay estampas, solo actualizar imagen
    actualizarImagen();
}

// Función para manejar clics en círculos de color
function setupColorSelectors() {
    // Selector de color de buzo
    colorBuzoSelector.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-option') && !e.target.classList.contains('hidden')) {
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

document.addEventListener("DOMContentLoaded", () => {
    setupColorSelectors();
    setupTalleSelector();

    actualizarImagen();
});

document.addEventListener("carrito-actualizado", function () {
    mostrarCarritoEnModal(); // refresca el modal
    actualizarContador();    // refresca el número rojo del carrito
});