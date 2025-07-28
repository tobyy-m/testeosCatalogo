/**
 * Sistema de pantalla de carga híbrido - OPTIMIZADO PARA RENDIMIENTO
 * Estrategia: CSS inline crítico + JS modular para máximo performance
 * Elimina FOUC y minimiza solicitudes HTTP
 */

class LoadingScreen {
  constructor(options = {}) {
    this.minDisplayTime = options.minDisplayTime || 600; // Reducido para mejor UX
    this.maxWaitTime = options.maxWaitTime || 2500; // Más agresivo
    this.fadeOutDuration = options.fadeOutDuration || 400; // Más rápido
    this.loadingElement = null;
    this.startTime = Date.now();
    this.isReady = false;
  }

  init() {
    this.loadingElement = document.getElementById('loading-screen');
    if (!this.loadingElement) {
      console.warn('Loading screen element not found');
      return;
    }

    // Configurar eventos
    this.setupEvents();
    
    // Monitorear recursos críticos
    this.monitorCriticalResources();
  }

  setupEvents() {
    // Cuando todo esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.markReady());
    } else {
      this.markReady();
    }

    // Fallback de seguridad
    setTimeout(() => {
      if (!this.isReady) {
        console.warn('Forcing loading screen removal after timeout');
        this.hide();
      }
    }, this.maxWaitTime);
  }

  monitorCriticalResources() {
    // Estrategia optimizada: Solo monitorear recursos realmente críticos
    const criticalImages = document.querySelectorAll('img[data-critical], .hero-image, .logo');
    const criticalFonts = document.fonts ? document.fonts.ready : Promise.resolve();
    
    let loadedImages = 0;
    const totalImages = criticalImages.length;

    // Promise para todos los recursos críticos
    const resourcePromises = [];

    // Monitorear fuentes críticas
    resourcePromises.push(criticalFonts);

    // Monitorear imágenes críticas
    if (totalImages > 0) {
      const imagePromise = new Promise((resolve) => {
        criticalImages.forEach(img => {
          if (img.complete && img.naturalHeight !== 0) {
            loadedImages++;
          } else {
            const onLoad = () => {
              loadedImages++;
              if (loadedImages === totalImages) resolve();
            };
            
            img.addEventListener('load', onLoad, { once: true });
            img.addEventListener('error', onLoad, { once: true });
            
            // Timeout individual por imagen
            setTimeout(onLoad, 1000);
          }
        });
        
        if (loadedImages === totalImages) resolve();
      });
      
      resourcePromises.push(imagePromise);
    }

    // Resolver cuando todos los recursos estén listos o timeout
    Promise.allSettled(resourcePromises).then(() => {
      this.markReady();
    });

    // Fallback si no hay recursos críticos
    if (resourcePromises.length === 1) {
      setTimeout(() => this.markReady(), 100);
    }
  }

  markReady() {
    if (this.isReady) return;
    this.isReady = true;

    const elapsedTime = Date.now() - this.startTime;
    const remainingTime = Math.max(0, this.minDisplayTime - elapsedTime);

    setTimeout(() => {
      this.hide();
    }, remainingTime);
  }

  hide() {
    if (!this.loadingElement) return;

    // Optimización: Usar transform para mejor rendimiento que opacity
    this.loadingElement.style.transition = `transform ${this.fadeOutDuration}ms ease-out, opacity ${this.fadeOutDuration}ms ease-out`;
    this.loadingElement.style.transform = 'translateY(-20px)';
    this.loadingElement.style.opacity = '0';

    setTimeout(() => {
      this.loadingElement.style.display = 'none';
      // Limpiar para liberar memoria
      this.loadingElement.style.transform = '';
      this.loadingElement.style.transition = '';
    }, this.fadeOutDuration);
  }

  // Método estático para inicialización rápida y optimizada
  static init(options = {}) {
    // Micro-optimización: evitar crear instancia si no hay loading screen
    if (!document.getElementById('loading-screen')) {
      return null;
    }
    
    const loader = new LoadingScreen(options);
    
    // Inicialización inmediata sin esperar DOMContentLoaded si es posible
    if (document.readyState !== 'loading') {
      loader.init();
    } else {
      // Usar requestIdleCallback si está disponible para mejor rendimiento
      if (window.requestIdleCallback) {
        requestIdleCallback(() => {
          document.addEventListener('DOMContentLoaded', () => loader.init(), { once: true });
        });
      } else {
        document.addEventListener('DOMContentLoaded', () => loader.init(), { once: true });
      }
    }
    
    return loader;
  }
}

// Auto-inicialización optimizada
LoadingScreen.init();
