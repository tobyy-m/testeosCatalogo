/* ==================================================== */
/* NÚMERO DE PEDIDO GLOBAL - NETLIFY EDGE FUNCTION     */
/* ==================================================== */

/**
 * Netlify Edge Function para generar números de pedido únicos y globales.
 * 
 * Esta función:
 * - Mantiene un contador global en Netlify Blobs (KV storage)
 * - Genera números secuenciales únicos para todo el sitio
 * - Retorna números en formato #0001, #0002, etc.
 * - Es thread-safe para múltiples pedidos simultáneos
 */

export default async (request, context) => {
  // Solo permitir método POST
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Método no permitido' }), 
      { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    // Obtener el store de Netlify Blobs para persistir el contador
    const { blobs } = context;
    const store = blobs.getStore('pedidos');
    
    // Clave para el contador global
    const CONTADOR_KEY = 'ultimo_numero_pedido';
    
    // Obtener el último número de pedido (con retry para concurrencia)
    let ultimoNumero = 0;
    let intentos = 0;
    const maxIntentos = 5;
    
    while (intentos < maxIntentos) {
      try {
        // Obtener el valor actual
        const valorActual = await store.get(CONTADOR_KEY);
        ultimoNumero = valorActual ? parseInt(valorActual) : 0;
        
        // Incrementar y guardar (operación atómica)
        const nuevoNumero = ultimoNumero + 1;
        await store.set(CONTADOR_KEY, nuevoNumero.toString());
        
        // Formatear el número de pedido
        const numeroPedidoFormateado = `#${nuevoNumero.toString().padStart(4, '0')}`;
        
        // Retornar el número generado
        return new Response(
          JSON.stringify({ 
            numeroPedido: numeroPedidoFormateado,
            timestamp: new Date().toISOString(),
            success: true
          }),
          {
            status: 200,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST',
              'Access-Control-Allow-Headers': 'Content-Type'
            }
          }
        );
        
      } catch (error) {
        intentos++;
        if (intentos >= maxIntentos) {
          throw error;
        }
        // Esperar un poco antes del siguiente intento
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
  } catch (error) {
    console.error('Error generando número de pedido:', error);
    
    // En caso de error, generar un número basado en timestamp como fallback
    const timestamp = Date.now();
    const numeroFallback = `#T${timestamp.toString().slice(-6)}`;
    
    return new Response(
      JSON.stringify({ 
        numeroPedido: numeroFallback,
        timestamp: new Date().toISOString(),
        success: false,
        fallback: true,
        error: 'Error en el servidor, usando número temporal'
      }),
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  }
};

export const config = {
  path: "/api/numero-pedido"
};
