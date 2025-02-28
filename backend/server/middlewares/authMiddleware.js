const { UnauthorizedError } = require("../utils/customErrors");

const protect = async (req, res, next) => {
    let token;

    // get token from header or cookie
    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next(new UnauthorizedError("Not authorized"));
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // attach user data to the request
        next();
    } catch (error) {
        next(new UnauthorizedError("Invalid token"));
    }
};

module.exports = { protect };