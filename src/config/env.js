require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    VERIFY_TOKEN: process.env.VERIFY_TOKEN,
    WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN,
};
