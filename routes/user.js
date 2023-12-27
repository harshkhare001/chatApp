const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

router.use(express.static("public"));

router.get('/signup', userController.getSignUpPage);

router.get('/login', userController.getLoginPage);

router.post('/signup', userController.addUser);

router.post('/login', userController.login);

router.get('/getAllUsers', userController.getAllUsers);

module.exports = router;