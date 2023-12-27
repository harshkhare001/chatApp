const express = require('express');
const groupController = require('../controllers/group');
const userAuthernticator = require('../middleware/auth');

const router = express.Router();

router.post('/addGroup', userAuthernticator.authenticate, groupController.addGroup);

router.get('/getGroups', userAuthernticator.authenticate, groupController.getGroups);

module.exports = router;