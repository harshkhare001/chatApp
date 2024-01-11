const express = require('express');
const messageController = require('../controllers/message');
const multerMiddleware = require('../middleware/multer');
const upload = multerMiddleware.multer.single('image');

const router = express.Router();

router.get('/dashboard', messageController.getDashboardPage);

router.post('/message/textMessage', messageController.getMessages);

router.post('/message/image', upload, messageController.saveImages);

router.get('/message/:groupId', messageController.fetchMessages);

module.exports = router;