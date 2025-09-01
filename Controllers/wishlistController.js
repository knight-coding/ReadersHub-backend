const User = require('../Model/users');
const Book = require('../Model/books');

// it checks if the user's wishlist contains the bookId or not and then reacts accordingly on every click

const toggleWishlist = async (req, res) => {
    try {
        const { id } = req.params; // book id
        if (!id) return res.status(400).json({ message: 'Book ID is required' });

        const user = await User.findOne({ email: req.user.email }).exec();
        if (!user) return res.status(404).json({ message: 'User not found' });

        const bookExists = await Book.findById(id).exec();
        if (!bookExists) return res.status(404).json({ message: 'Book not found' });

        let isInWishlist;
        let message;
        if (user.wishlist.includes(id)) {
            user.wishlist = user.wishlist.filter(book => book.toString() !== id);
            isInWishlist = false;
            message = 'Book removed from wishlist';
        } else {
            user.wishlist.push(id);
            isInWishlist = true;
            message = 'Book added to wishlist';
        }

        await user.save();
        res.json({ message, wishlist: user.wishlist, isInWishlist });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const inWishlist = async (req, res) => {
    try{
        const { id } = req.params; // book id
        if (!id) return res.status(400).json({ message: 'Book ID is required' });

        const user = await User.findOne({ email: req.user.email }).exec();
        if (!user) return res.status(404).json({ message: 'User not found' });

        const bookExists = await Book.findById(id).exec();
        if (!bookExists) return res.status(404).json({ message: 'Book not found' });

        let isInWishlist;
        if(user.wishlist.includes(id)){
            isInWishlist = true;
        }else{
            isInWishlist = false;
        }

        await user.save();
        res.json({ isInWishlist });
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // Comes from verifyJWT
    const user = await User.findById(userId).populate('wishlist').exec();
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
    getWishlist,
    inWishlist,
    toggleWishlist
};