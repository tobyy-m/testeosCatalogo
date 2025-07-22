document.addEventListener("DOMContentLoaded", () => {
    const botonesFiltro = document.querySelectorAll(".btn-filtro");
    const secciones = document.querySelectorAll("section[data-categoria]");

    botonesFiltro.forEach(boton => {
        boton.addEventListener("click", () => {
            const filtro = boton.dataset.filtro;

            // Quitar clase activa de todos los botones
            botonesFiltro.forEach(b => b.classList.remove("active"));

            // Agregar clase activa al botón actual
            boton.classList.add("active");

            // Mostrar u ocultar secciones
            secciones.forEach(seccion => {
                const categoria = seccion.dataset.categoria;
                const mostrar = filtro === "todos" || filtro === categoria;
                seccion.style.display = mostrar ? "block" : "none";
            });
        });
    });
});
