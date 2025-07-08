async function enviarEmailClienteSeguro(formData) {
    try {
        const datos = Object.fromEntries(formData);
        const emailContent = crearHTMLEmail(datos);
        const response = await fetch('https://formsubmit.co/ajax/tu-email@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: `Cliente: ${datos.nombre} ${datos.apellido}`,
                email: datos.email,
                subject: `🛒 Nuevo Pedido #${datos.numeroPedido} - MIT ESTAMPADOS`,
                message: `
NUEVO PEDIDO RECIBIDO

📋 Pedido: #${datos.numeroPedido}
👤 Cliente: ${datos.nombre} ${datos.apellido}
📧 Email: ${datos.email}
📱 Teléfono: ${datos.telefono}

📍 Dirección:
${datos.calle} ${datos.numero}
${datos.localidad}, CP: ${datos.cp}

💳 Pago: ${datos.pago}

🛍️ Productos:
${datos.resumenCompleto}
---
Este pedido fue generado automáticamente desde la tienda online.
                `,
                _replyto: datos.email, 
                _subject: `🛒 Nuevo Pedido #${datos.numeroPedido} - MIT ESTAMPADOS`,
                _template: 'table',
                _captcha: 'false',
                _autoresponse: `Hola ${datos.nombre},

¡Gracias por tu compra en MIT ESTAMPADOS!

Tu pedido #${datos.numeroPedido} ha sido recibido exitosamente.

📋 RESUMEN DEL PEDIDO:
${datos.resumenCompleto}

📍 DIRECCIÓN DE ENTREGA:
${datos.calle} ${datos.numero}, ${datos.localidad}

💳 MÉTODO DE PAGO: ${datos.pago === 'efectivo' ? 'Efectivo' : 'Transferencia Bancaria'}

📞 PRÓXIMOS PASOS:
• Nos contactaremos en las próximas 24 horas
• Confirmaremos detalles de entrega y pago
• Te notificaremos cuando esté listo

¡Gracias por elegir MIT ESTAMPADOS!
Instagram: @mit.estampados

---
Este es un email automático de confirmación.`
            })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const resultado = await response.json();
        console.log('✅ Email enviado exitosamente:', resultado);
        
        return { success: true, message: 'Email enviado correctamente' };

    } catch (error) {
        console.error('❌ Error enviando email:', error);
        throw error;
    }
}

function crearHTMLEmail(datos) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .section { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .productos { background: #f8f9fa; padding: 15px; border-radius: 6px; font-family: monospace; white-space: pre-line; }
        .destacado { background: #e8f4fd; padding: 15px; border-radius: 6px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 ¡Gracias por tu compra!</h1>
        <h2>MIT ESTAMPADOS</h2>
    </div>
    
    <div class="content">
        <h3>Hola ${datos.nombre} ${datos.apellido || ''},</h3>
        
        <div class="section">
            <h4>📋 Información del Pedido</h4>
            <p><strong>Número:</strong> #${datos.numeroPedido}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-AR')}</p>
            <p><strong>Email:</strong> ${datos.email}</p>
            <p><strong>Teléfono:</strong> ${datos.telefono}</p>
        </div>

        <div class="section">
            <h4>📍 Dirección de Entrega</h4>
            <p>${datos.calle} ${datos.numero}</p>
            <p>${datos.localidad}, CP: ${datos.cp}</p>
        </div>

        <div class="section">
            <h4>🛍️ Productos</h4>
            <div class="productos">${datos.resumenCompleto}</div>
        </div>

        <div class="destacado">
            <h4>💳 Método de Pago</h4>
            <p><strong>${datos.pago === 'efectivo' ? '💵 Efectivo' : '🏦 Transferencia Bancaria'}</strong></p>
        </div>

        <div class="destacado">
            <h4>📞 Próximos Pasos</h4>
            <ul>
                <li>Nos contactaremos en 24 horas</li>
                <li>Confirmaremos detalles de entrega</li>
                <li>Te notificaremos cuando esté listo</li>
            </ul>
        </div>
        
        <p style="text-align: center; margin-top: 30px;">
            <strong>¡Gracias por elegir MIT ESTAMPADOS!</strong><br>
            Instagram: @mit.estampados
        </p>
    </div>
</body>
</html>
    `;
}
