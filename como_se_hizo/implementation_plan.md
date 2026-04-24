# Inicialización del Bot de WhatsApp (Meta Cloud API)

Este plan describe la configuración inicial de un servidor web básico para recibir y enviar mensajes a través de la API de WhatsApp de Meta. Esto servirá como la base del bot, el cual podrás posteriormente integrar con n8n.

## User Review Required

> [!IMPORTANT]
> **Aprobación del entorno y alcance:**
> Propongo crear este proyecto usando **Node.js con Express**. Es el estándar más sencillo y robusto para recibir los *Webhooks* (eventos de mensajes) de Meta y responder. ¿Estás de acuerdo con usar Node.js? 
> 
> Crearé el proyecto en una nueva carpeta en tu entorno local llamada `whatsapp-bot` (`C:\Users\elysdan\.gemini\antigravity\scratch\whatsapp-bot`). ¿Te parece bien esta ubicación?

## Open Questions

> [!WARNING]
> 1. **Uso de n8n:** Mencionas que posteriormente lo conectarás con n8n. ¿Tu idea es que este código de Node.js haga un puente hacia n8n, o prefieres eventualmente migrar toda la lógica del webhook directamente a n8n? (n8n puede recibir webhooks de Meta directamente, pero tener este código primero es excelente para entender cómo funciona la API y tener control total).
> 2. **Respuestas iniciales:** Para esta primera fase, ¿quieres que el bot responda con un mensaje de "Hola, recibí tu mensaje" automáticamente cuando alguien le escriba?

## Proposed Changes

### Servidor de Webhook (Node.js)

Se creará la estructura básica del proyecto con los siguientes archivos:

#### [NEW] `package.json`
Inicialización del proyecto con las dependencias necesarias: `express` (para el servidor web), `axios` (para hacer peticiones HTTP a Meta y luego a n8n), y `dotenv` (para manejar las variables de entorno de forma segura).

#### [NEW] `.env`
Archivo para guardar tus credenciales de forma segura. Aquí colocaremos:
- `WHATSAPP_TOKEN`: Tu token de acceso (EAAM...).
- `PHONE_NUMBER_ID`: El ID de tu número (102709...).
- `VERIFY_TOKEN`: Un token inventado por nosotros para verificar el webhook en la configuración de Meta.

#### [NEW] `index.js`
El código principal del servidor. Contendrá:
1. **Endpoint GET `/webhook`:** Necesario para que Meta valide que nuestro servidor es legítimo.
2. **Endpoint POST `/webhook`:** El lugar donde Meta enviará los mensajes entrantes (textos, imágenes, etc.).
3. **Función de respuesta:** Lógica inicial para extraer el número del remitente y enviarle un mensaje de vuelta usando la API de Meta.

## Verification Plan

### Manual Verification
1. Ejecutaremos el servidor localmente (`node index.js`).
2. Expondremos tu servidor local a internet (recomendado usar herramientas como `ngrok` o `localtunnel` si estás en pruebas locales, aunque esto será un paso que deberás hacer en tu máquina).
3. Configuraremos el Webhook en el panel de desarrolladores de Meta.
4. Enviaremos un mensaje de WhatsApp a tu número de prueba y verificaremos que el servidor lo recibe y responde.
