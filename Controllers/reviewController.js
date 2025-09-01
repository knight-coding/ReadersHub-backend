// TODO: section that handles "addReview" by a user "updateReview" and "deleteReview"
const Review = require('../Model/review');
const books = require('../Model/books')

const createReview = async (req, res) => {
    try{
        const {comment, rating} = req.body;
        const { id: bookId } = req.params;
        const userId = req.user.id ;
        if(!comment || !rating || !bookId || !userId) return res.status(400).json({'message' : 'rating is required'});
        const book = await books.findById(bookId).exec();
        if(!book){
            return res.status(404).json({'message': `No Book matches the ID ${req.body.id}`});
        }

        const newReview = await Review.create({
            comment,
            bookId,
            rating,
            userId
        })
        // console.log(newReview);
        res.status(201).json(newReview);
    } catch(error){
        // console.error("Create Review Error:", error.message);
        res.status(500).json({'message' : 'failed to add review'});
    }
}

// DELETE /reviews/:id
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const review = await Review.findOneAndDelete({ _id: id, userId });

        if (!review) return res.status(404).json({ error: 'Review not found' });

        res.json({ message: 'Review deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};


// GET /reviews/book/:bookId
const getReviewsByBook = async (req, res) => {
    try {
        const { id: bookId } = req.params;

        if (!bookId) return res.status(404).json({ error: 'BookId not found' });
        const reviews = await Review.find({ bookId })
            .populate('userId'); // get reviewer details

        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /reviews/user/:userId
const getReviewsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const reviews = await Review.find({ userId })
            .populate('bookId', 'title author'); // get book details

        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getReviewsByUser,
    getReviewsByBook,
    deleteReview,
    createReview
}