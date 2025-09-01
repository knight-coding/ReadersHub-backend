const express = require('express');
const router = express.Router();
const reviewController = require('../../Controllers/reviewController')
const BookController = require('../../Controllers/BookController');
// to get all books and books by category.

router.get('/all', BookController.getAllBooks);
router.get('/:id', BookController.getBookById)
router.get('/category/:genre', BookController.getBooksByCategory);
router.get('/getReviews/:id', reviewController.getReviewsByBook);

module.exports = router;
