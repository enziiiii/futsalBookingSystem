const jwt = require("jsonwebtoken");

/* by using payload style
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
*/

const validateEnv = () => {
    const requiredVars = [
        'JWT_ACCESS_SECRET',
        'JWT_REFRESH_SECRET',
        'JWT_ACCESS_EXPIRES_IN',
        'JWT_REFRESH_EXPIRES_IN'
    ];

    requiredVars.forEach(varName => {
        if (!process.env[varName]) {
            throw new Error(`Missing required environment variable: ${varName}`);
        }
    });
};

validateEnv();

const generateToken = (user) => ({
    accessToken: jwt.sign(
        {
            userId: user.user_id, // From users table
            email: user.email,
            roles: user.roles  // Array from user_roles join
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
    ),

    refreshToken: jwt.sign(
        { 
            userId: user.user_id 
        }, 
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    )
});

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
        throw new Error('Invalid access token: ' + error.message);
    }
};

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new Error('Invalid refresh token: ' + error.message);
    }
};

module.exports = {
    generateToken,
    verifyAccessToken,
    verifyRefreshToken
};