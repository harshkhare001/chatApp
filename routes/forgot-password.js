const express = require('express');

const forgotpasswordController = require('../controllers/forgot-password');

const router = express.Router();

router.get('/forgotpassword', forgotpasswordController.getHomePage);

router.post('/forgotpassword', forgotpasswordController.sendEmail);

router.get('/resetpassword/:uu_id', forgotpasswordController.getResetPasswordPage);

router.post('/password/resetpassword', forgotpasswordController.changePassword);

module.exports = router;