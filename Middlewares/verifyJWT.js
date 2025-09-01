const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader){ 
        return res.sendStatus(401);
    } // Unauthorized
    
    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); // Forbidden
            req.user = decoded.UserInfo;
            next();
        }
    );
};

module.exports = verifyJWT;
