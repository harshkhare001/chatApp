const express = require('express');
const messageController = require('../controllers/messages');

const router = express.Router();

router.get('/dashboard', messageController.getDashboardPage);

module.exports = router;