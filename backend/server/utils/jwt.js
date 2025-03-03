const jwt = require("jsonwebtoken");

/* by using payload style
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
*/

const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user.user_id, // From users table
            email: user.email,
            roles: user.roles  // Array from user_roles join
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
    generateToken,
    verifyToken
};