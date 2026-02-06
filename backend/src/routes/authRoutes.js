const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authLimiter } = require('../utils/rateLimiter');

router.post('/register', authLimiter, userController.register);
router.post('/login', authLimiter, userController.login);

module.exports = router;