# Configuración de Netlify Forms
# Este archivo configura el envío automático de emails a los clientes

# Netlify enviará automáticamente los emails usando los datos del formulario
# El email se enviará al campo "emailCliente" con el asunto y contenido especificados

# Para configurar en Netlify:
# 1. Ve a Site settings > Forms
# 2. Habilita form notifications
# 3. Configura email notifications con:
#    - To email: {{emailCliente}}
#    - Subject: MIT ESTAMPADOS - RECIBIMOS TU PEDIDO
#    - Message: {{resumenCompleto}}

# También puedes configurar una notificación a tu email de administrador:
# - To email: tu-email@ejemplo.com
# - Subject: Nuevo pedido {{numeroPedido}} recibido
# - Message: 
#   Cliente: {{nombre}} {{apellido}}
#   Email: {{email}}
#   Teléfono: {{telefono}}
#   Dirección: {{calle}} {{numero}}, {{localidad}} ({{cp}})
#   Pago: {{pago}}
#   
#   Productos:
#   {{productos}}
#   
#   Resumen completo:
#   {{resumenCompleto}}
