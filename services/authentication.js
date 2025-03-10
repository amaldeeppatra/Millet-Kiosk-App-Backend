const JWT = require("jsonwebtoken");
require('dotenv').config();
const secret = process.env.jwtsecretkey;

function createTokenForUser(user){
    const payload = {
        _id: user._id,
        // email: user.email,
        user: user,
    };
    const options = {
        expiresIn: '1h' // Token expires in 7 hours
    };
    const token = JWT.sign(payload, secret, options);

    // const token = JWT.sign(payload, secret);
    return token;
}

function validateToken(token){
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken,
};