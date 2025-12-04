// Optimización del filtro de productos con debounce, mejores transiciones y URL parameters
document.addEventListener("DOMContentLoaded", () => {
  const filtroSelect = document.getElementById("filtroSelect");
  const botonesFiltro = document.querySelectorAll(".btn-filtro"); // Para compatibilidad con botones antiguos
  const secciones = document.querySelectorAll("section[data-categoria]");

  // Cache de elementos para mejor rendimiento
  const elementCache = new Map();
  secciones.forEach((seccion) => {
    elementCache.set(seccion.dataset.categoria, seccion);
  });

  // Funciones para manejar URL parameters
  function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  function setURLParameter(name, value) {
    const url = new URL(window.location);
    if (value === "todos") {
      url.searchParams.delete(name); // Remover parámetro si es "todos"
    } else {
      url.searchParams.set(name, value);
    }
    window.history.replaceState({}, "", url);
  }

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
  const aplicarFiltro = debounce((filtro, updateURL = true) => {
    requestAnimationFrame(() => {
      const columnas = document.querySelectorAll(
        "[data-categoria] .row.g-4 > .col-md-4"
      );

      // --- NUEVO INGRESO: mostrar solo tarjetas con .card.nuevo ---
      if (filtro === "nuevoIngreso") {
        // Mostrar (provisionalmente) todas las secciones
        secciones.forEach((sec) => {
          sec.style.display = "";
        });

        // Ocultar/mostrar columnas según tengan una tarjeta .nuevo
        columnas.forEach((col) => {
          const esNuevo = col.querySelector(".card.nuevo");
          if (esNuevo) {
            col.style.display = "";
          } else {
            col.style.display = "none";
          }
        });

        // Ocultar secciones que quedaron sin columnas visibles
        secciones.forEach((sec) => {
          const tieneVisible = sec.querySelector(
            '.col-md-4:not([style*="display: none"])'
          );
          sec.style.display = tieneVisible ? "" : "none";
        });

        if (updateURL) setURLParameter("filtro", filtro);
        return; // Importante: cortar aquí
      }

      // --- PAREJAS: mostrar solo productos con data-coleccion="parejas" ---
      if (filtro === "parejas") {
        // Mostrar todas las secciones
        secciones.forEach((sec) => {
          sec.style.display = "";
        });

        // Ocultar/mostrar columnas según tengan data-coleccion="parejas"
        columnas.forEach((col) => {
          if (col.dataset.coleccion === "parejas") {
            col.style.display = "";
          } else {
            col.style.display = "none";
          }
        });

        // Ocultar secciones que quedaron sin columnas visibles
        secciones.forEach((sec) => {
          const tieneVisible = sec.querySelector(
            '.col-md-4:not([style*="display: none"])'
          );
          sec.style.display = tieneVisible ? "" : "none";
        });

        if (updateURL) setURLParameter("filtro", filtro);
        return;
      }

      // --- PAREJAS: mostrar solo productos con data-coleccion="parejas" ---
      if (filtro === "parejas") {
        // Mostrar todas las secciones
        secciones.forEach((sec) => {
          sec.style.display = "";
        });

        // Ocultar/mostrar columnas según tengan data-coleccion="parejas"
        columnas.forEach((col) => {
          if (col.dataset.coleccion === "parejas") {
            col.style.display = "";
          } else {
            col.style.display = "none";
          }
        });

        // Ocultar secciones que quedaron sin columnas visibles
        secciones.forEach((sec) => {
          const tieneVisible = sec.querySelector(
            '.col-md-4:not([style*="display: none"])'
          );
          sec.style.display = tieneVisible ? "" : "none";
        });

        if (updateURL) setURLParameter("filtro", filtro);
        return;
      }

      // --- Resto de filtros existentes (por categoría / todos) ---
      columnas.forEach((col) => {
        // Restaurar todas las columnas al cambiar de "nuevoIngreso" a otro filtro
        if (col.style.display === "none") col.style.display = "";
      });

      secciones.forEach((seccion) => {
        if (filtro === "todos") {
          seccion.style.display = "";
        } else {
          seccion.style.display =
            seccion.dataset.categoria === filtro ? "" : "none";
        }
      });

      if (updateURL) setURLParameter("filtro", filtro);
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
  botonesFiltro.forEach((boton) => {
    boton.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        const filtro = boton.dataset.filtro;

        // Optimizar manipulación del DOM
        botonesFiltro.forEach((b) => b.classList.remove("active"));
        boton.classList.add("active");

        aplicarFiltro(filtro);
      },
      { passive: true }
    );
  });

  // Activar filtro inicial desde URL o valor por defecto
  const filtroURL = getURLParameter("filtro");
  const filtroInicial = filtroURL || "todos";

  if (filtroSelect) {
    // Establecer el valor del select según la URL
    filtroSelect.value = filtroInicial;
    aplicarFiltro(filtroInicial, false); // No actualizar URL en carga inicial
  } else if (botonesFiltro.length > 0) {
    // Para compatibilidad con botones
    const botonActivo =
      Array.from(botonesFiltro).find(
        (b) => b.dataset.filtro === filtroInicial
      ) || botonesFiltro[0];
    botonesFiltro.forEach((b) => b.classList.remove("active"));
    botonActivo.classList.add("active");
    aplicarFiltro(botonActivo.dataset.filtro, false); // No actualizar URL en carga inicial
  }
});
