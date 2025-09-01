const books = require('../Model/books')

const addBook = async (req , res) => {
    try {
        const {title, author, description, isTrending, genre, coverImage, source} = req.body;
        if(!title || !genre || !source) return res.status(400).json({'message' : 'Not Enough details'});

        const duplicate = await books.findOne({ 
            title: title.trim(), 
            author: author?.trim() || "Unknown" 
        }).exec();

        if (duplicate) {
            return res.status(409).json({ message: 'Book already exists' }); // 409 Conflict
        }

        const newBook = await books.create({
            title,
            author: author?.trim() || 'Unknown',
            description: description || '',
            isTrending: isTrending ?? false,
            rating: 0,
            totalReviews: 0,
            coverImage: coverImage || '',
            source: source || '',
            genre
        });

        res.status(201).json({"success" : `New Book ${title} Created`});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'addBook error' });
    }
}

const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'id parameter is required' });
    
        const book = await books.findById(id).exec();
        if(!book){
            return res.status(404).json({'message': `No Book matches the ID ${req.body.id}`});
        }
    
        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'getBooksbyId error' });
    }
}

const updateBook = async (req, res) => {
    try {
        if (!req?.body?.id) {
            return res.status(400).json({ message: 'id parameter is required' });
        }

        const book = await books.findOne({ _id: req.body.id }).exec();
        if (!book) {
            return res.status(404).json({ message: `No Book matches the ID ${req.body.id}` });
        }

        // Update only the fields provided in request body
        const updatedBook = await books.findByIdAndUpdate(
            req.body.id,
            req.body, // directly apply changes from request body
            { new: true, runValidators: true } // return updated doc, validate schema
        );

        res.json(updatedBook);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'id parameter is required' });
    
        const book = await books.findById(id).exec();
        if(!book){
            return res.status(404).json({'message': `No Book matches the ID ${req.body.id}`});
        }

        const deletedBook = await books.findByIdAndDelete(id).exec();
        res.json({ message: `Book with ID ${id} deleted successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'deleteBook error' });
    }
}

const getAllBooks = async (req, res) => {
    const allBooks = await books.find();
    if(!allBooks.length) return res.status(204).json({'message' : 'No books found.'});
    res.json(allBooks);
}

const getBooksByCategory = async (req, res) => {
  try {
    const { genre } = req.params;
    if (!genre) return res.status(400).json({ message: 'Genre is required' });

    // Find books where genre array contains the requested genre (case-insensitive)
    const booksFound = await books.find({ 
      genre: { $in: [genre] } 
    }).exec();

    if (!booksFound.length) {
      return res.status(404).json({ message: `No books found in genre: ${genre}` });
    }

    res.json({ books: booksFound }); // consistent with frontend expecting { books: [...] }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
    getAllBooks, 
    addBook,
    updateBook,
    deleteBook,
    getBookById,
    getBooksByCategory
}