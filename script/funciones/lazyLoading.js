// Polyfill para loading="lazy" en navegadores no compatibles
if (!("loading" in HTMLImageElement.prototype)) {
  const script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/npm/loading-attribute-polyfill@2/dist/loading-attribute-polyfill.umd.js";
  document.head.appendChild(script);
}

// Lazy loading optimizado con Intersection Observer
document.addEventListener("DOMContentLoaded", function () {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
              img.classList.remove("img-placeholder");

              // Preload siguiente imagen del carrusel
              const parentCarousel = img.closest(".carousel");
              if (parentCarousel) {
                const nextImg = parentCarousel.querySelector(
                  "img[data-src]:not([src])"
                );
                if (nextImg) {
                  const link = document.createElement("link");
                  link.rel = "prefetch";
                  link.href = nextImg.dataset.src;
                  document.head.appendChild(link);
                }
              }
            }
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.01,
      }
    );

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback para navegadores sin Intersection Observer
    document.querySelectorAll("img[data-src]").forEach((img) => {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
      img.classList.remove("img-placeholder");
    });
  }
});
