require('dotenv').config();
const express = require('express');
const axios = require('axios'); // Añadimos axios nuevamente para poder enviar
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;
const whatsappToken = process.env.WHATSAPP_TOKEN;
const phoneNumberId = process.env.PHONE_NUMBER_ID;

app.get('/', (req, res) => {
    const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

    if (mode === 'subscribe' && token === verifyToken) {
        console.log('WEBHOOK VERIFIED');
        res.status(200).send(challenge);
    } else {
        res.status(403).end();
    }
});

app.post('/', async (req, res) => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    console.log(`\n\nWebhook received ${timestamp}\n`);
    
    // Descomenta esto si quieres seguir viendo todo el JSON en consola
    // console.log(JSON.stringify(req.body, null, 2));

    const body = req.body;

    // Retornamos 200 rápido para que Meta sepa que lo recibimos
    res.status(200).end();

    // Verificamos y navegamos por la estructura del mensaje
    if (body.object === 'whatsapp_business_account') {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const messages = value?.messages;

        // Si hay mensajes válidos y de tipo texto
        if (messages && messages.length > 0) {
            const message = messages[0];
            const from = message.from; // Número de origen
            const msgBody = message.text?.body; // Contenido del mensaje

            console.log(`Mensaje recibido de ${from}: "${msgBody}"`);

            if (msgBody) {
                // Respondemos con exactamente el mismo texto
                await sendReply(from, msgBody);
            }
        }
    }
});

async function sendReply(to, text) {
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
                type: 'text',
                text: { body: text }
            }
        });
        console.log(`Eco enviado exitosamente a ${to}`);
    } catch (error) {
        console.error('Error al enviar el mensaje:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

app.listen(port, () => {
    console.log(`\nListening on port ${port}\n`);
});
