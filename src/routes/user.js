const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');


router.post('/register', userController.registerUser);
router.post('/update-fcm-token', userController.updateFcmToken);

module.exports = router;