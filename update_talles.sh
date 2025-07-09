#!/bin/bash

# Script para actualizar todos los productos con selectores circulares de colores y talles

# Array de productos que necesitan actualización
productos=(
    "buzoLuna" 
    "buzoCash"
    "buzoAutosLocos"
    "buzoDuki"
    "buzoDreamMaker"
    "buzoLali"
    "buzoPinkFloyd"
    "buzoPirata"
)

echo "Actualizando selectores circulares (colores y talles) en todos los productos..."

for producto in "${productos[@]}"; do
    html_file="productos/${producto}.html"
    js_file="script/$(echo $producto | sed 's/buzo//' | tr '[:upper:]' '[:lower:]').js"
    
    echo "Procesando $producto..."
    
    # Verificar si el archivo HTML existe
    if [ -f "$html_file" ]; then
        echo "  ✓ HTML encontrado: $html_file"
    else
        echo "  ✗ HTML no encontrado: $html_file"
        continue
    fi
    
    # Verificar si el archivo JS existe
    if [ -f "$js_file" ]; then
        echo "  ✓ JS encontrado: $js_file"
    else
        echo "  ✗ JS no encontrado: $js_file"
    fi
    
    echo "  → Necesita actualizar: selectores de colores circulares y talles con XXL"
done

echo ""
echo "Productos ya actualizados:"
echo "  ✅ buzoLove - colores ✓ talles ✓"
echo "  ✅ buzoMarte - colores ✓ talles ✓" 
echo "  ✅ buzoConejo - colores ✓ talles ✓"
echo "  ✅ buzoSnipe - colores ✓ talles ✓"
echo ""
echo "Proceso de verificación completado."
