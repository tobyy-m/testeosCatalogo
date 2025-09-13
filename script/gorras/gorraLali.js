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
    const basePath = `../../imagenes/gorras/gorraLali/gorraLali_${gorra}_${estampa}`;
    cargarImagen(imgGorra, basePath, "");
}

const opcionesPorColorGorra = {
  "Negro": ["Blanco", "Rosa"],
  "Blanco": ["Negro", "Rosa"]
};

function actualizarOpcionesEstampa() {
    const gorra = colorGorra.value;
    const opciones = opcionesPorColorGorra[gorra] || [];

    // Ocultar/mostrar círculos de color de estampa
    const allEstampaOptions = colorEstampaSelector.querySelectorAll('.color-option');
    allEstampaOptions.forEach(option => {
        const colorValue = option.getAttribute('data-value');
        if (opciones.includes(colorValue)) {
            option.classList.remove('hidden');
        } else {
            option.classList.add('hidden');
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
        if (newSelected && !newSelected.classList.contains('hidden')) {
            newSelected.classList.add('selected');
        }
    }

    actualizarImagen(); // actualiza con el primer color disponible
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

    // Selector de color de estampa
    colorEstampaSelector.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-option') &&
            !e.target.classList.contains('hidden')) {
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
    actualizarOpcionesEstampa(); // Aplicar restricciones iniciales
    actualizarImagen();
});

document.addEventListener("carrito-actualizado", function () {
    mostrarCarritoEnModal(); // refresca el modal
    actualizarContador();    // refresca el número rojo del carrito
});