let button = document.getElementById("myButton");
let isBlack = true; // Modo oscuro por defecto

// Transiciones suaves para todos los elementos que cambian color
const smoothElements = [
  document.body,
  document.querySelector("header"),
  document.querySelector("footer"),
  document.querySelector(".navbar"),
  ...document.querySelectorAll(".card")
];

smoothElements.forEach(el => {
  el.style.transition = "background-color 0.5s ease, color 0.5s ease";
});

// Función para aplicar el tema según el estado de isBlack
function aplicarModo() {
  if (isBlack) {
    // Modo oscuro
    document.body.style.background = "black";
    document.body.style.color = "#ccc";
    button.innerHTML = '<i class="bi bi-sun-fill"></i>';
    button.classList.remove("btn-light");
    button.classList.add("btn-dark");

    document.querySelectorAll(".card").forEach((card) => {
      card.style.backgroundColor = "#1e1e1e";
      card.style.color = "#ccc";
    });

    document.querySelectorAll(".btn-ver-mas").forEach((btn) => {
      btn.classList.remove("btn-outline-primary");
      btn.classList.add("btn-outline-light");
    });

    document.querySelector("header").style.backgroundColor = "#222";
    document.querySelector("footer").style.backgroundColor = "#222";
    document.querySelector("footer").style.color = "#ccc";

    document.querySelector(".navbar").classList.remove("bg-primary");
    document.querySelector(".navbar").classList.add("bg-dark");

  } else {
    // Modo claro
    document.body.style.background = "#ccc";
    document.body.style.color = "black";
    button.innerHTML = '<i class="bi bi-moon-fill"></i>';
    button.classList.remove("btn-dark");
    button.classList.add("btn-light");

    document.querySelectorAll(".card").forEach((card) => {
      card.style.backgroundColor = "white";
      card.style.color = "black";
    });

    document.querySelectorAll(".btn-ver-mas").forEach((btn) => {
      btn.classList.remove("btn-outline-light");
      btn.classList.add("btn-outline-primary");
    });

    document.querySelector("header").style.backgroundColor = "#007bff";
    document.querySelector("footer").style.backgroundColor = "#007bff";
    document.querySelector("footer").style.color = "white";

    document.querySelector(".navbar").classList.remove("bg-dark");
    document.querySelector(".navbar").classList.add("bg-primary");
  }
}

// Cambiar modo al hacer clic
button.addEventListener("click", function () {
  isBlack = !isBlack;
  aplicarModo();
});

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", aplicarModo);
