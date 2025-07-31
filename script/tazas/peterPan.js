/* ─── Referencias al DOM ─────────────────────────────── */
const colorEstampa = document.getElementById("colorEstampa");  // modelo1 | modelo2 
const imgTaza = document.getElementById("imgTaza");            // imagen de la taza
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
    const modelo = colorEstampa.value;    // modelo1 / modelo2
    const url = `../../imagenes/tazas/peterPan/peterPan_${modelo}.webp`;
    fadeLoad(imgTaza, url);
}

// Configurar selectores circulares de modelo (solo si existe el selector)
if (modeloSelector) {
    modeloSelector.addEventListener("click", (e) => {
        const option = e.target.closest('.talle-option');
        if (!option) return;

        // Actualizar selección visual
        modeloSelector.querySelectorAll('.talle-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');

        // Actualizar valor del input hidden
        colorEstampa.value = option.dataset.value;

        // Actualizar imagen
        actualizarImagen();
    });
}

/* ─── Eventos ─────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", actualizarImagen);

document.addEventListener("carrito-actualizado", function () {
    mostrarCarritoEnModal(); // refresca el modal
    actualizarContador();    // refresca el número rojo del carrito
});