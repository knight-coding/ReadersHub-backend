const mongoose = require('mongoose');

const userSchema  = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    fullname:{
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    refreshToken: {
        type: String,
        
    },
    roles: {
        type: [String],
        default: ["User"]
    },
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
        }
    ]
}, {timestamps: true}
)

module.exports = mongoose.model("User", userSchema);