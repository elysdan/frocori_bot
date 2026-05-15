const { COOLDOWN_MS } = require('../config/constants');

// Clave: número de teléfono, Valor: timestamp (Date.now()) del último envío
const templateCooldowns = new Map();

class CooldownService {
    /**
     * Verifica si el número está en cooldown
     * @param {string} from - Número de teléfono
     * @returns {object} { isOnCooldown: boolean, minutesRemaining: number }
     */
    checkCooldown(from) {
        const lastSent = templateCooldowns.get(from);
        const now = Date.now();

        if (lastSent && (now - lastSent) < COOLDOWN_MS) {
            const minutesRemaining = Math.ceil((COOLDOWN_MS - (now - lastSent)) / 60000);
            return { isOnCooldown: true, minutesRemaining };
        }

        return { isOnCooldown: false, minutesRemaining: 0 };
    }

    /**
     * Actualiza el cooldown de un número
     * @param {string} from - Número de teléfono
     */
    setCooldown(from) {
        templateCooldowns.set(from, Date.now());
    }
}

module.exports = new CooldownService();
