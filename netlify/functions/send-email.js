const https = require('https');

exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Manejar preflight OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método no permitido' }),
    };
  }

  try {
    // Parsear datos del pedido
    const {
      clienteEmail,
      clienteNombre,
      numeroPedido,
      resumenCompleto,
      direccion,
      metodoPago,
      telefono
    } = JSON.parse(event.body);

    // Validar datos requeridos
    if (!clienteEmail || !clienteNombre || !numeroPedido) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Datos requeridos faltantes' }),
      };
    }

    // Email de confirmación para el cliente (HTML profesional)
    const emailClienteHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Pedido - MIT ESTAMPADOS</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; font-weight: bold;">MIT ESTAMPADOS</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">¡Gracias por tu compra!</p>
    </div>

    <!-- Número de pedido -->
    <div style="background-color: #e7f3ff; padding: 25px; text-align: center; border-bottom: 3px solid #007bff;">
      <h2 style="color: #007bff; margin: 0; font-size: 24px;">Pedido ${numeroPedido}</h2>
      <p style="margin: 8px 0 0 0; color: #666; font-size: 16px;">Tu pedido ha sido recibido exitosamente</p>
    </div>

    <!-- Contenido principal -->
    <div style="padding: 30px;">
      
      <!-- Saludo -->
      <h3 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">Hola ${clienteNombre},</h3>
      <p style="color: #666; line-height: 1.6; margin: 0 0 25px 0;">
        ¡Gracias por confiar en nosotros! Tu pedido está siendo procesado y pronto nos contactaremos contigo.
      </p>
      
      <!-- Resumen del pedido -->
      <div style="margin-bottom: 25px;">
        <h4 style="color: #007bff; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e9ecef; padding-bottom: 8px;">
          🛍️ Resumen del Pedido
        </h4>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
          <pre style="margin: 0; font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.4; white-space: pre-wrap; color: #333;">${resumenCompleto}</pre>
        </div>
      </div>

      <!-- Información de entrega -->
      <div style="margin-bottom: 25px;">
        <h4 style="color: #007bff; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e9ecef; padding-bottom: 8px;">
          📍 Información de Entrega
        </h4>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <p style="margin: 0 0 10px 0; color: #333;"><strong>📍 Dirección:</strong> ${direccion}</p>
          <p style="margin: 0 0 10px 0; color: #333;"><strong>💳 Método de Pago:</strong> ${metodoPago}</p>
          <p style="margin: 0; color: #333;"><strong>📱 Teléfono:</strong> ${telefono}</p>
        </div>
      </div>

      <!-- Próximos pasos -->
      <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
        <h4 style="color: #856404; margin: 0 0 15px 0; font-size: 18px;">📋 Próximos Pasos:</h4>
        <ul style="color: #856404; margin: 0; padding-left: 20px; line-height: 1.6;">
          <li>Nos contactaremos en las próximas 24 horas</li>
          <li>Confirmaremos detalles de entrega y pago</li>
          <li>Te notificaremos cuando esté listo para entrega</li>
        </ul>
      </div>

    </div>

    <!-- Footer -->
    <div style="background-color: #f8f9fa; padding: 25px; text-align: center; border-top: 1px solid #e9ecef;">
      <p style="color: #666; margin: 0 0 10px 0; font-size: 16px;">¡Gracias por elegir MIT ESTAMPADOS!</p>
      <p style="color: #666; margin: 0 0 15px 0;">
        <strong>Instagram:</strong> 
        <a href="https://instagram.com/mit.estampados" style="color: #007bff; text-decoration: none;">@mit.estampados</a>
      </p>
      <p style="color: #999; font-size: 12px; margin: 0;">
        Este es un email automático de confirmación.
      </p>
    </div>

  </div>
</body>
</html>`;

    // Función para enviar email via MailerSend
    const enviarEmail = (emailData) => {
      return new Promise((resolve, reject) => {
        const postData = JSON.stringify(emailData);
        
        const options = {
          hostname: 'api.mailersend.com',
          port: 443,
          path: '/v1/email',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.MAILERSEND_API_KEY}`,
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            if (res.statusCode === 202) {
              resolve({ success: true, statusCode: res.statusCode, data });
            } else {
              try {
                const errorData = JSON.parse(data);
                reject(new Error(`MailerSend Error: ${JSON.stringify(errorData)}`));
              } catch (e) {
                reject(new Error(`HTTP ${res.statusCode}: ${data}`));
              }
            }
          });
        });

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
      });
    };

    // Email de confirmación para el cliente
    const emailCliente = {
      from: {
        email: "noreply@mitestampados.com",
        name: "MIT ESTAMPADOS"
      },
      to: [
        {
          email: clienteEmail,
          name: clienteNombre
        }
      ],
      subject: `🎉 Confirmación de Pedido ${numeroPedido} - MIT ESTAMPADOS`,
      html: emailClienteHTML,
      text: `Hola ${clienteNombre},

¡Gracias por tu compra en MIT ESTAMPADOS!

Tu pedido ${numeroPedido} ha sido recibido exitosamente.

RESUMEN DEL PEDIDO:
${resumenCompleto}

DIRECCIÓN DE ENTREGA: ${direccion}
MÉTODO DE PAGO: ${metodoPago}
TELÉFONO: ${telefono}

PRÓXIMOS PASOS:
• Nos contactaremos en las próximas 24 horas
• Confirmaremos detalles de entrega y pago
• Te notificaremos cuando esté listo

¡Gracias por elegir MIT ESTAMPADOS!
Instagram: @mit.estampados

---
Este es un email automático de confirmación.`
    };

    // Email de notificación para el dueño
    const emailDueno = {
      from: {
        email: "noreply@mitestampados.com",
        name: "MIT ESTAMPADOS Sistema"
      },
      to: [
        {
          email: process.env.OWNER_EMAIL,
          name: "Dueño MIT ESTAMPADOS"
        }
      ],
      subject: `🔔 Nuevo Pedido ${numeroPedido} - ${clienteNombre}`,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fff; border: 1px solid #ddd; border-radius: 8px;">
  <div style="background-color: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h2 style="margin: 0;">🔔 NUEVO PEDIDO RECIBIDO</h2>
  </div>
  
  <div style="padding: 25px;">
    <h3 style="color: #dc3545; margin-top: 0;">Pedido: ${numeroPedido}</h3>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <p style="margin: 5px 0;"><strong>Cliente:</strong> ${clienteNombre}</p>
      <p style="margin: 5px 0;"><strong>Email:</strong> ${clienteEmail}</p>
      <p style="margin: 5px 0;"><strong>Teléfono:</strong> ${telefono}</p>
      <p style="margin: 5px 0;"><strong>Dirección:</strong> ${direccion}</p>
      <p style="margin: 5px 0;"><strong>Método de Pago:</strong> ${metodoPago}</p>
    </div>
    
    <h4 style="color: #007bff;">Detalle del pedido:</h4>
    <div style="background-color: #f1f1f1; padding: 15px; border-radius: 5px; font-family: monospace; white-space: pre-wrap; font-size: 14px;">
${resumenCompleto}
    </div>
    
    <div style="margin-top: 20px; padding: 15px; background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px;">
      <p style="margin: 0; color: #155724; font-weight: bold;">✅ Email de confirmación enviado automáticamente al cliente.</p>
    </div>
  </div>
</div>`,
      text: `NUEVO PEDIDO RECIBIDO

Pedido: ${numeroPedido}
Cliente: ${clienteNombre}
Email: ${clienteEmail}
Teléfono: ${telefono}
Dirección: ${direccion}
Método de Pago: ${metodoPago}

DETALLE DEL PEDIDO:
${resumenCompleto}

Email de confirmación enviado automáticamente al cliente.`
    };

    // Enviar ambos emails
    const [resultadoCliente, resultadoDueno] = await Promise.all([
      enviarEmail(emailCliente),
      enviarEmail(emailDueno)
    ]);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Emails enviados exitosamente via MailerSend',
        pedido: numeroPedido,
        cliente: 'enviado',
        dueno: 'enviado'
      }),
    };

  } catch (error) {
    console.error('Error enviando emails:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error interno del servidor',
        message: error.message 
      }),
    };
  }
};
