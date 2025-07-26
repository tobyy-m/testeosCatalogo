document.addEventListener("DOMContentLoaded", () => {
    // Crear el lightbox una sola vez
    const lightbox = document.createElement("div");
    lightbox.id = "lightbox-global";
    lightbox.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background-color: rgba(0,0,0,0.85);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        cursor: zoom-out;
    `;

    const imgAmpliada = document.createElement("img");
    imgAmpliada.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border: 4px solid white;
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
    `;

    lightbox.appendChild(imgAmpliada);
    document.body.appendChild(lightbox);

    // Cerrar lightbox al hacer clic
    lightbox.addEventListener("click", () => {
        lightbox.style.display = "none";
        imgAmpliada.src = "";
    });

    // Agregar comportamiento a todas las imágenes con clase 'ampliable'
    document.querySelectorAll("img.ampliable").forEach(img => {
        img.style.cursor = "zoom-in";
        img.addEventListener("click", () => {
            imgAmpliada.src = img.src;
            lightbox.style.display = "flex";
        });
    });
});
