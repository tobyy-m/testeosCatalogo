// Optimización del filtro de productos con debounce y mejores transiciones
document.addEventListener("DOMContentLoaded", () => {
    const filtroSelect = document.getElementById("filtroSelect");
    const botonesFiltro = document.querySelectorAll(".btn-filtro"); // Para compatibilidad con botones antiguos
    const secciones = document.querySelectorAll("section[data-categoria]");
    
    // Cache de elementos para mejor rendimiento
    const elementCache = new Map();
    secciones.forEach(seccion => {
        elementCache.set(seccion.dataset.categoria, seccion);
    });

    // Función de debounce para evitar múltiples ejecuciones rápidas
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Función optimizada de filtrado
    const aplicarFiltro = debounce((filtro) => {
        // Usar requestAnimationFrame para mejor rendimiento visual
        requestAnimationFrame(() => {
            secciones.forEach(seccion => {
                const categoria = seccion.dataset.categoria;
                const mostrar = filtro === "todos" || filtro === categoria;
                
                if (mostrar) {
                    seccion.style.display = "block";
                    // Trigger lazy loading para imágenes recién visibles
                    seccion.querySelectorAll('img[data-src]').forEach(img => {
                        if (img.getBoundingClientRect().top < window.innerHeight + 100) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            img.classList.remove('img-placeholder');
                        }
                    });
                } else {
                    seccion.style.display = "none";
                }
            });
        });
    }, 100);

    // Event listener para dropdown
    if (filtroSelect) {
        filtroSelect.addEventListener("change", (e) => {
            const filtro = e.target.value;
            aplicarFiltro(filtro);
        });
    }

    // Event listeners para botones (compatibilidad con páginas que aún usan botones)
    botonesFiltro.forEach(boton => {
        boton.addEventListener("click", (e) => {
            e.preventDefault();
            const filtro = boton.dataset.filtro;

            // Optimizar manipulación del DOM
            botonesFiltro.forEach(b => b.classList.remove("active"));
            boton.classList.add("active");

            aplicarFiltro(filtro);
        }, { passive: true });
    });

    // Activar filtro inicial
    if (filtroSelect) {
        aplicarFiltro(filtroSelect.value);
    } else if (botonesFiltro.length > 0) {
        const filtroInicial = botonesFiltro[0];
        filtroInicial.classList.add("active");
        aplicarFiltro(filtroInicial.dataset.filtro);
    }
});
