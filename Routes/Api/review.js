const express = require('express');
const router = express.Router();
const reviewController = require('../../Controllers/reviewController')
const verifyJWT = require('../../Middlewares/verifyJWT')

router.post('/add/:id', verifyJWT, reviewController.createReview);
router.delete('/remove/:id', reviewController.deleteReview);

module.exports = router;