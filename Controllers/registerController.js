const User = require('../Model/users')
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { username, fullname, email, password } = req.body;

    if (!username || !fullname || !email || !password) {
        return res.status(400).json({ message: 'Username, fullname, email, and password are required' });
    }
    // checking for duplicates
    const duplicateUser = await User.findOne({ username }).exec();
    const duplicateEmail = await User.findOne({ email }).exec();
    if (duplicateUser || duplicateEmail) return res.sendStatus(409); // Conflict
    try{
        // Encrypt password.
        const hashedPwd = await bcrypt.hash(password, 10);
        // create and Store the new user.
        const newUser = await User.create({
            username,
            fullname,
            email,
            password: hashedPwd
        });
        
        res.status(201).json({"Success" : `New user ${newUser.username} created`});
    }catch(err) {
        res.status(500).json({'message' : err.message}); 
    }
}

module.exports = { handleNewUser };