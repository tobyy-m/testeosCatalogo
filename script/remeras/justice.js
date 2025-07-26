const colorRemera = document.getElementById("colorRemera");
const colorEstampa = document.getElementById("colorEstampa");
const colorRemeraSelector = document.getElementById("colorRemeraSelector");
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
    const remera = colorRemera.value;
    const estampa = colorEstampa ? colorEstampa.value : "";
    const basePath = `../../imagenes/remeras/justice/justice_${remera}_${estampa}`;
    cargarImagen(imgFront, basePath, "front");
    cargarImagen(imgBack, basePath, "back");
}

const opcionesPorColorRemera = {
  "blanco": ["amarillo", "verde", "celeste", "rojo", "azulMarino", "negro", "naranja"],
  "negro": ["arena", "amarillo", "verde", "celeste", "rojo", "blanco", "naranja"],
  "rojo": ["arena", "celeste", "azulMarino", "blanco", "negro"],
  "naranja": ["arena", "celeste", "azulMarino", "blanco", "negro"],
  "azulMarino": ["arena", "amarillo", "rojo", "blanco"]
};

function actualizarOpcionesEstampa() {
    const remera = colorRemera.value;
    const opciones = opcionesPorColorRemera[remera] || [];

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
    // Selector de color de remera
    colorRemeraSelector.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-option') && !e.target.classList.contains('hidden')) {
            // Quitar selección anterior
            colorRemeraSelector.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            // Agregar selección nueva
            e.target.classList.add('selected');
            // Actualizar input oculto
            colorRemera.value = e.target.getAttribute('data-value');
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
    actualizarOpcionesEstampa(); // Aplicar restricciones iniciales
    actualizarImagen();
});

document.addEventListener("carrito-actualizado", function () {
    mostrarCarritoEnModal(); // refresca el modal
    actualizarContador();    // refresca el número rojo del carrito
});