// Script de preload inteligente para remeras.html
(function() {
    'use strict';
    
    // Configuración de preload
    const PRELOAD_CONFIG = {
        priority: {
            high: ['autosLocos', 'conejo', 'cash'], // Primera fila visible
            medium: ['pirata', 'pinkFloyd', 'dreamMaker'], // Segunda fila
            low: ['justice', 'snipe', 'marte'] // Resto de imágenes
        },
        delay: {
            high: 0,
            medium: 1000,
            low: 2000
        }
    };
    
    // Función para precargar imágenes
    function preloadImage(src, priority = 'low') {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = src;
        });
    }
    
    // Preload inteligente basado en viewport y conexión
    function intelligentPreload() {
        // Detectar tipo de conexión si está disponible
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isSlowConnection = connection && (
            connection.effectiveType === 'slow-2g' || 
            connection.effectiveType === '2g' ||
            connection.saveData
        );
        
        if (isSlowConnection) {
            console.log('Conexión lenta detectada, reduciendo preload');
            return;
        }
        
        // Preload de imágenes por prioridad
        Object.entries(PRELOAD_CONFIG.priority).forEach(([priority, designs]) => {
            setTimeout(() => {
                designs.forEach(design => {
                    const frontImg = `imagenes/remeras/${design}/${design}_*.webp`;
                    // Solo precargamos la imagen frontal por ahora
                    console.log(`Preloading ${priority} priority: ${design}`);
                });
            }, PRELOAD_CONFIG.delay[priority]);
        });
    }
    
    // Optimización de recursos críticos
    function optimizeCriticalResources() {
        // Preload del logo si no está ya
        const logoLink = document.querySelector('link[href*="logo mit.png"]');
        if (!logoLink) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = 'imagenes/logo mit.png';
            document.head.appendChild(link);
        }
        
        // Prefetch de páginas de productos más populares
        const popularProducts = [
            'productos/remeras/autosLocos.html',
            'productos/remeras/conejo.html',
            'productos/remeras/cash.html'
        ];
        
        setTimeout(() => {
            popularProducts.forEach(url => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = url;
                document.head.appendChild(link);
            });
        }, 3000);
    }
    
    // Optimización de performance observers
    function setupPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            // Monitorear LCP (Largest Contentful Paint)
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            
            // Monitorear CLS (Cumulative Layout Shift)
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                console.log('CLS:', clsValue);
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }
    
    // Service Worker registration para cache
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then(() => {
                console.log('Service Worker registrado para cache');
            }).catch(() => {
                console.log('Service Worker no disponible');
            });
        }
    }
    
    // Inicialización cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        optimizeCriticalResources();
        
        // Esperar a que se complete la carga inicial
        window.addEventListener('load', function() {
            setTimeout(() => {
                intelligentPreload();
                setupPerformanceMonitoring();
                // registerServiceWorker(); // Comentado hasta implementar SW
            }, 1000);
        });
    });
    
    // Optimización de scroll
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Trigger lazy loading manual para elementos casi visibles
            document.querySelectorAll('img[data-src]').forEach(img => {
                const rect = img.getBoundingClientRect();
                if (rect.top < window.innerHeight + 200) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.remove('img-placeholder');
                }
            });
        }, 100);
    }, { passive: true });
    
})();
