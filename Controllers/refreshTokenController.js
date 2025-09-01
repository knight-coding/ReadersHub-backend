const User = require('../Model/users')
const jwt = require('jsonwebtoken');

// 🔒 Goal:
// To issue a new access token if the user's refresh token (stored in a cookie) is valid.

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    // console.log(cookies);
    if(!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec(); // exec -> execute
    if(!foundUser) return res.sendStatus(403); // forbidden
    // Evaluate Jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles); // new
            
            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        id: foundUser._id,
                        email: foundUser.email,
                        fullname: foundUser.fullname,
                        roles: roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn : '1d'}
            );
            res.json({accessToken});
        }
    )
}

module.exports = { handleRefreshToken }