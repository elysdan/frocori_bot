const axios = require('axios');
const { WHATSAPP_TOKEN } = require('../config/env');

class WhatsAppService {
    /**
     * Enviar plantilla de bienvenida
     * @param {string} to - Número de destino
     * @param {string} phoneNumberId - ID del número de origen
     */
    async sendWelcomeTemplate(to, phoneNumberId) {
        try {
            await axios({
                method: 'POST',
                url: `https://graph.facebook.com/v25.0/${phoneNumberId}/messages`,
                headers: {
                    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
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
}

module.exports = new WhatsAppService();
