const mongoose = require('mongoose');
require('dotenv').config();

// console.log('MONGO_URI:', process.env.DATABASE_URI);
const connectDB = async () => {
    try{
        mongoose.connection.on('connected', () => {
            console.log('DB Connected');
        })
        await mongoose.connect(`${process.env.DATABASE_URI}/BookReview`);
    } catch(err){
        console.error(err.message);
    }
}

module.exports = connectDB;