/* ============================================ */
/* CONFIGURACIÓN GLOBAL DE OPTIMIZACIÓN */
/* ============================================ */

window.MITConfig = {
  // Configuración de rutas
  paths: {
    images: 'imagenes/',
    css: 'css/',
    js: 'script/',
    components: 'componentes/'
  },
  
  // Configuración de rendimiento
  performance: {
    lazyLoadOffset: 100, // px antes de que el elemento entre en viewport
    debounceDelay: 150,  // ms para eventos de scroll/resize
    preloadDelay: 2000   // ms para precargar recursos no críticos
  },
  
  // Configuración de tema
  theme: {
    default: 'light',
    storageKey: 'theme',
    transitionDuration: '0.3s'
  },
  
  // Configuración de carrito
  cart: {
    storageKey: 'carritoMit',
    maxQuantity: 10,
    notificationDuration: 3000
  }
};

/* ============================================ */
/* UTILIDADES GLOBALES OPTIMIZADAS */
/* ============================================ */

window.MITUtils = {
  // Lazy loading optimizado
  lazyLoad: function(selector = '[loading="lazy"]') {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            img.classList.remove('img-placeholder');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: `${MITConfig.performance.lazyLoadOffset}px`
      });

      document.querySelectorAll(selector).forEach(img => observer.observe(img));
    }
  },

  // Debounce optimizado
  debounce: function(func, wait = MITConfig.performance.debounceDelay) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Preload optimizado
  preload: function(resources) {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as || 'image';
      if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
      document.head.appendChild(link);
    });
  },

  // Cargar scripts de forma optimizada
  loadScript: function(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.onload = callback;
    script.onerror = () => console.warn(`Error loading script: ${src}`);
    document.head.appendChild(script);
  },

  // Formatear precio
  formatPrice: function(price) {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  },

  // Almacenamiento optimizado
  storage: {
    get: function(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.warn(`Error reading from localStorage: ${key}`, error);
        return defaultValue;
      }
    },

    set: function(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.warn(`Error writing to localStorage: ${key}`, error);
        return false;
      }
    },

    remove: function(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.warn(`Error removing from localStorage: ${key}`, error);
        return false;
      }
    }
  }
};

/* ============================================ */
/* INICIALIZACIÓN AUTOMÁTICA */
/* ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Aplicar lazy loading
  MITUtils.lazyLoad();
  
  // Precargar recursos críticos después de 2 segundos
  setTimeout(() => {
    const criticalResources = [
      { href: 'imagenes/logo mit.png', as: 'image' },
      // Agregar más recursos críticos aquí
    ];
    MITUtils.preload(criticalResources);
  }, MITConfig.performance.preloadDelay);
  
  // Optimizar imágenes cargadas dinámicamente
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          const lazyImages = node.querySelectorAll ? node.querySelectorAll('[loading="lazy"]') : [];
          lazyImages.forEach(img => MITUtils.lazyLoad());
        }
      });
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
});

console.log('MIT Config loaded successfully');
