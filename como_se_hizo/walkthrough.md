# Configuración del Webhook de WhatsApp

El código de tu bot básico ya está listo en la carpeta `whatsapp-bot`. Hemos utilizado Node.js con Express para crear un servidor que escuchará los mensajes entrantes y responderá automáticamente.

Aquí tienes los pasos exactos para ponerlo en marcha y conectarlo con la API de Meta.

## Paso 1: Configurar las variables de entorno

1. Ve a la carpeta `C:\Users\elysdan\.gemini\antigravity\scratch\whatsapp-bot`.
2. Abre el archivo `.env`.
3. Reemplaza los valores con los que usaste en Postman:
   - `WHATSAPP_TOKEN`: El token largo que empieza con `EAAM...`
   - `PHONE_NUMBER_ID`: El número identificador, como `1027095807164767`.
   - `VERIFY_TOKEN`: Déjalo como `mi_super_token_123` o pon cualquier texto seguro que quieras. Este lo usaremos en Meta para verificar tu servidor.

## Paso 2: Iniciar tu servidor

Abre una terminal en la carpeta `whatsapp-bot` y ejecuta:
```bash
node index.js
```
Deberías ver un mensaje que dice: `Servidor de Webhook de WhatsApp escuchando en el puerto 3000`. No cierres esta ventana, el servidor debe estar corriendo.

## Paso 3: Exponer tu servidor a Internet (con ngrok)

Meta necesita una URL pública segura (`https`) para enviar los mensajes. Como tu servidor corre en `localhost`, necesitamos exponerlo usando una herramienta gratuita como **ngrok**.

1. Si no tienes ngrok, descárgalo e instálalo desde [ngrok.com](https://ngrok.com/).
2. Abre **otra** terminal y ejecuta:
```bash
ngrok http 3000
```
3. ngrok te dará una URL en la sección "Forwarding" que se verá algo como `https://abcd-12-34-56-78.ngrok-free.app`. **Copia esa URL (solo la parte https)**.

## Paso 4: Configurar el Webhook en Meta

1. Ve al [Panel de Desarrolladores de Meta](https://developers.facebook.com/).
2. Entra en tu App y ve a la sección de **WhatsApp > Configuración de la API** (o Configuración en el menú lateral izquierdo).
3. Busca la sección que dice **Webhook** y haz clic en "Configurar" o "Editar".
4. Te pedirá dos cosas:
   - **URL de devolución de llamada (Callback URL)**: Pega la URL de ngrok y añádele `/webhook` al final. Ejemplo: `https://abcd-12-34-56-78.ngrok-free.app/webhook`
   - **Token de verificación (Verify Token)**: Pega el token que pusiste en tu archivo `.env` (ej. `mi_super_token_123`).
5. Haz clic en "Verificar y guardar". (Si todo está bien y tu servidor está corriendo, Meta aceptará la URL).
6. **MUY IMPORTANTE**: Debajo de la configuración de URL, haz clic en **"Administrar"** y suscríbete al campo de webhooks llamado **`messages`**. (Sin esto, Meta no te enviará los mensajes de texto).

## Paso 5: ¡Prueba tu bot!

Envíale un mensaje de WhatsApp desde tu teléfono personal al número de prueba que te dio Meta. Deberías ver en la terminal donde corre `node index.js` que el mensaje llegó, y automáticamente te responderá a tu WhatsApp: "¡Hola! Recibí tu mensaje...".

> [!TIP]
> **Sobre n8n:** Esta base que hemos creado es perfecta. Cuando quieras integrar n8n, lo único que haremos en `index.js` es tomar el mensaje recibido y hacerle un `axios.post()` a una URL de un Webhook de tu servidor de n8n, dejando que n8n haga toda la lógica pesada.
