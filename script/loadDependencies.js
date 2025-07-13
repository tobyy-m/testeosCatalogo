/**
 * Script para cargar dependencias comunes en el head
 * Elimina la necesidad de repetir las mismas líneas en cada HTML
 */

(function() {
    'use strict';
    
    // Configuración de dependencias
    const dependencies = {
        preconnects: [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://cdn.jsdelivr.net'
        ],
        stylesheets: [
            {
                href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap',
                rel: 'stylesheet'
            },
            {
                href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
                rel: 'stylesheet'
            },
            {
                href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css',
                rel: 'stylesheet'
            },
            {
                href: 'css/styles.css',
                rel: 'stylesheet'
            }
        ],
        scripts: [
            {
                src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
                defer: true
            }
        ]
    };
    
    // Función para crear elementos link de preconnect
    function addPreconnects() {
        dependencies.preconnects.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = url;
            if (url.includes('gstatic')) {
                link.crossOrigin = 'anonymous';
            }
            document.head.appendChild(link);
        });
    }
    
    // Función para crear elementos link de CSS
    function addStylesheets() {
        dependencies.stylesheets.forEach(stylesheet => {
            const link = document.createElement('link');
            link.rel = stylesheet.rel;
            link.href = stylesheet.href;
            document.head.appendChild(link);
        });
    }
    
    // Función para crear elementos script
    function addScripts() {
        dependencies.scripts.forEach(script => {
            const scriptElement = document.createElement('script');
            scriptElement.src = script.src;
            if (script.defer) {
                scriptElement.defer = true;
            }
            document.head.appendChild(scriptElement);
        });
    }
    
    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            addPreconnects();
            addStylesheets();
            addScripts();
        });
    } else {
        addPreconnects();
        addStylesheets();
        addScripts();
    }
})();
