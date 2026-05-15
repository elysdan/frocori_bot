const { VERIFY_TOKEN } = require('../config/env');
const whatsappService = require('../services/whatsapp.service');
const cooldownService = require('../services/cooldown.service');

class WebhookController {
    /**
     * Verifica el Webhook (GET)
     */
    verifyWebhook(req, res) {
        const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.status(403).end();
        }
    }

    /**
     * Recepción de mensajes (POST)
     */
    async receiveMessage(req, res) {
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
                const { isOnCooldown, minutesRemaining } = cooldownService.checkCooldown(from);

                if (isOnCooldown) {
                    console.log(`Cooldown activo para ${from}. Faltan ~${minutesRemaining} min. No se envía plantilla.`);
                    return;
                }

                // Enviamos la plantilla de bienvenida
                await whatsappService.sendWelcomeTemplate(from, receivedPhoneNumberId);

                // Registramos el momento del envío para el cooldown
                cooldownService.setCooldown(from);
            }
        }
    }
}

module.exports = new WebhookController();
