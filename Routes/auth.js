const express = require('express')
const router = express.Router();
const verifyJWT = require('../Middlewares/verifyJWT')
const authController = require('../Controllers/authContoller');

router.post('/', authController.handleLogin);
router.get('/verify', verifyJWT, (req, res) => {
    const roles = req.user.roles || [];
    res.json({
        loggedIn: true,
        role: roles,
        user: req.user // this is set inside verifyJWT after decoding token
    });
});

module.exports = router;