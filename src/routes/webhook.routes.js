const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook.controller');

// Definición de las rutas del webhook
router.get('/', webhookController.verifyWebhook);
router.post('/', webhookController.receiveMessage);

module.exports = router;
