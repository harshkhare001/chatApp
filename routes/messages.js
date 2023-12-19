const express = require('express');
const messageController = require('../controllers/messages');

const router = express.Router();

router.get('/dashboard', messageController.getDashboardPage);

router.post('/getmessage', messageController.getMessages);

router.get('/fetchMessages', messageController.fetchMessages);

module.exports = router;