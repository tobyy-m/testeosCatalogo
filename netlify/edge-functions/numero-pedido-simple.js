/* ================================================================ */
/* NÚMERO DE PEDIDO SIMPLE - NETLIFY EDGE FUNCTION (SIN BLOBS)     */
/* ================================================================ */

/**
 * Versión simplificada de la Edge Function para generar números de pedido.
 * 
 * Esta versión NO requiere Netlify Blobs y usa timestamp + random como base.
 * Es una alternativa si se prefiere no usar almacenamiento persistente.
 * 
 * Formato: #YYMMDD-HHmm-RR (Año, Mes, Día, Hora, Minuto, Random)
 * Ejemplo: #240115-1030-47
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
    // Obtener timestamp actual
    const ahora = new Date();
    
    // Formatear fecha y hora
    const año = ahora.getFullYear().toString().slice(-2);
    const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
    const dia = ahora.getDate().toString().padStart(2, '0');
    const hora = ahora.getHours().toString().padStart(2, '0');
    const minuto = ahora.getMinutes().toString().padStart(2, '0');
    
    // Generar componente aleatorio (00-99)
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    
    // Construir número de pedido único
    const numeroPedido = `#${año}${mes}${dia}-${hora}${minuto}-${random}`;
    
    // Retornar el número generado
    return new Response(
      JSON.stringify({ 
        numeroPedido: numeroPedido,
        timestamp: ahora.toISOString(),
        success: true,
        tipo: 'timestamp-based'
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
    console.error('Error generando número de pedido:', error);
    
    // Fallback ultra-simple
    const timestamp = Date.now();
    const numeroFallback = `#E${timestamp.toString().slice(-8)}`;
    
    return new Response(
      JSON.stringify({ 
        numeroPedido: numeroFallback,
        timestamp: new Date().toISOString(),
        success: false,
        fallback: true,
        error: 'Error generando número'
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
  path: "/api/numero-pedido-simple"
};
