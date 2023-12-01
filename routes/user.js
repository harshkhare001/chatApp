const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

router.use(express.static("public"));

router.get('/signup', userController.getSignUpPage);

router.get('/login', userController.getLoginPage);

router.post('/signup', userController.addUser);

module.exports = router;