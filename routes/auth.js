const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

router.post('/log-in', authController.loginPOST);

router.get('/log-out', authController.logout);

router.get('/sign-up', authController.signUpGET);

router.post('/sign-up', authController.signUpPOST);

module.exports = router;
