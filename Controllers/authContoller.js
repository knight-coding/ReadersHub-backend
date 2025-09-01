const User = require('../Model/users')
const bcrypt = require('bcrypt');
const { decrypt } = require('dotenv');
const jwt = require('jsonwebtoken');


const handleLogin = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) return res.status(400).json({'message' : 'Email and password are required'});

    const foundUser = await User.findOne({ email: email }).exec(); // exec -> execute
    if(!foundUser) return res.sendStatus(401);  // Unauthorized
    // Evaluate Password
    const match = await bcrypt.compare(password, foundUser.password);

    if(match){

        try {
            const roles = Object.values(foundUser.roles);
            // Newly added
            const accessToken = jwt.sign(  // available to all.
                {
                    UserInfo: {
                        id: foundUser._id,
                        email: foundUser.email,
                        fullname: foundUser.fullname,
                        roles: roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn : '1d' }
            );
            
            const refreshToken = jwt.sign(  // available to all.
                { "username" : foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn : '2d' }
            );

            // Saving refreshToken with current user
            foundUser.refreshToken = refreshToken;
            const result = await foundUser.save();
            
            res.cookie('jwt',
                refreshToken, { 
                    httpOnly: true,
                    sameSite : 'None',
                    /* secure : true,  // not for thunder client only for chrome */
                    maxAge: 24 * 60 * 60 * 1000
                }
            ) // 1 day -> (24 * 60 * 60 * 1000)ms
            res.json({accessToken});
        } 
        catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error in authController.js' });
        }
    } else{
        res.Status(401).json({message: 'Error in authController.js'});
    }
}

module.exports = { handleLogin };