const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

router.use(express.static("public"));

router.get('/signup',userController.getSignUpPage);

module.exports = router;