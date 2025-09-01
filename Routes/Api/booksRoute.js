const express = require('express');
const router = express.Router();
const BookController = require('../../Controllers/BookController');
const verifyRoles = require('../../Middlewares/verifyRoles');
// to add/delete books we need an admin or editor login

router.post('/add', verifyRoles('Admin', 'Editor'), BookController.addBook);
router.delete('/remove/:id', verifyRoles('Admin', 'Editor'), BookController.deleteBook);

module.exports = router;