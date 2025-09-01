require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./Config/corsOptions.js');
const verifyJWT = require('./Middlewares/verifyJWT.js');
const cookieParser = require('cookie-parser');
const credentials = require('./Middlewares/credentials.js');
const mongoose = require('mongoose');
const connectDB = require('./Config/dbConnect');
const PORT = process.env.PORT || 3500;

connectDB();

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({extended : false}));

app.use(express.json());

app.use(cookieParser());

// Routes
app.use('/register', require('./Routes/register'));
app.use('/auth', require('./Routes/auth.js'));
app.use('/refresh', require('./Routes/refresh.js'));
app.use('/logout', require('./Routes/logout.js'));
app.use('/store', require('./Routes/Api/storeRoute.js'));


app.use(verifyJWT);
app.use('/books', require('./Routes/Api/booksRoute.js'));
app.use('/books/wishlist', require('./Routes/Api/wishlist.js'));
app.use('/book/review', require('./Routes/Api/review.js'))


mongoose.connection.once('open', () => {
    console.log("connected to mongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})