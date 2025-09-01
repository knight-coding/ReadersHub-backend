const express = require('express');
const router = express.Router();
const authController = require('../Controllers/refreshTokenController');

router.get('/', authController.handleRefreshToken);

module.exports = router;