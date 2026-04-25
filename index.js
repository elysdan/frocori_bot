require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;
const whatsappToken = process.env.WHATSAPP_TOKEN;

// Cooldown: guardamos la última vez que se envió la plantilla a cada número
// Clave: número de teléfono, Valor: timestamp (Date.now()) del último envío
const templateCooldowns = new Map();
const COOLDOWN_MS = 60 * 60 * 1000; // 1 hora en milisegundos

// Verificación del Webhook
app.get('/', (req, res) => {
    const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

    if (mode === 'subscribe' && token === verifyToken) {
        console.log('WEBHOOK VERIFIED');
        res.status(200).send(challenge);
    } else {
        res.status(403).end();
    }
});

// Recepción de mensajes
app.post('/', async (req, res) => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    console.log(`\n\nWebhook received ${timestamp}\n`);

    const body = req.body;

    // Retornamos 200 rápido para que Meta sepa que lo recibimos
    res.status(200).end();

    // Verificamos que sea un evento de WhatsApp Business
    if (body.object === 'whatsapp_business_account') {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const messages = value?.messages;

        // Extraemos el ID del número que RECIBIÓ el mensaje
        const receivedPhoneNumberId = value?.metadata?.phone_number_id;

        if (messages && messages.length > 0 && receivedPhoneNumberId) {
            const message = messages[0];
            const from = message.from;

            console.log(`Mensaje recibido de ${from}: "${message.text?.body || message.type}"`);

            // Verificamos el cooldown antes de enviar la plantilla
            const lastSent = templateCooldowns.get(from);
            const now = Date.now();

            if (lastSent && (now - lastSent) < COOLDOWN_MS) {
                const minutosRestantes = Math.ceil((COOLDOWN_MS - (now - lastSent)) / 60000);
                console.log(`Cooldown activo para ${from}. Faltan ~${minutosRestantes} min. No se envía plantilla.`);
                return;
            }

            // Enviamos la plantilla de bienvenida
            await sendTemplate(from, receivedPhoneNumberId);

            // Registramos el momento del envío para el cooldown
            templateCooldowns.set(from, now);
        }
    }
});

// Enviar plantilla de bienvenida
async function sendTemplate(to, phoneNumberId) {
    try {
        await axios({
            method: 'POST',
            url: `https://graph.facebook.com/v25.0/${phoneNumberId}/messages`,
            headers: {
                Authorization: `Bearer ${whatsappToken}`,
                'Content-Type': 'application/json'
            },
            data: {
                messaging_product: 'whatsapp',
                to: to,
                type: 'template',
                template: {
                    name: 'bienvenido_a_frocori',
                    language: {
                        code: 'es_ES' // Cambia esto si tu plantilla usa otro idioma (ej: es_MX, en_US)
                    }
                }
            }
        });
        console.log(`Plantilla "bienvenido_a_frocori" enviada a ${to} desde ${phoneNumberId}`);
    } catch (error) {
        console.error('Error al enviar plantilla:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

app.listen(port, () => {
    console.log(`\nListening on port ${port}\n`);
});
