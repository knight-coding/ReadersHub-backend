const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    genre: {
        type: [String], // Allows multiple genres
        default: []
    },
    coverImage: {
        type: String, // store image URL or path
        default: 'https://tse1.mm.bing.net/th/id/OIP.L2dJOJN8qb8oAiOxGIZnpgHaFx?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    isTrending: {
        type: Boolean,
        default: false,
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    source: { // for affliated link
        type: String,
        required: true,
        trim: true
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, {timestamps: true});

module.exports = mongoose.model('Book', bookSchema);