const express = require('express');
const router = express.Router();
const verifyJWT = require('../../Middlewares/verifyJWT');
const wishlistController = require('../../Controllers/wishlistController');

router.get('/mywishlist', verifyJWT, wishlistController.getWishlist);
router.get('/:id', wishlistController.inWishlist);
router.post('/toggle/:id', wishlistController.toggleWishlist);

module.exports = router;