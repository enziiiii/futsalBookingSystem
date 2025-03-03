const authService = require("../services/authService");
const { UnauthorizedError, ForbiddenError } = require("../utils/customErrors");
const { verifyAccessToken } = require("../utils/jwt");

/* 
const protect = async (req, res, next) => {
    let token;

    // get token from header or cookie
    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        return next(new UnauthorizedError("Not authorized"));
    }

    try {
        const decoded = verifyAccessToken(token);
        req.user =  {// attach user data to the request 
            userId: decoded.userId, 
            email: decoded.email,
            roles: decoded.roles
        };
        next();
    } catch (error) {
        next(new UnauthorizedError("Invalid token"));
    }
};
*/

const protect = async (req, res, next) => {
    const token = req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null;
    
    if (!token) {
        return next(new UnauthorizedError("Authentication required"));
    }

    try {
        // verify and decode token
        const decoded = verifyAccessToken(token);

        // check token revocation
        const isRevoked = await authService.isTokenRevoked(token);
        if (isRevoked) {
            throw new UnauthorizedError("Session expiered");
        }

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            roles: decoded.roles
        };

        next();
    } catch (error) {
        const message = error.name === "TokenExpiredError"
            ? "Session expired"
            : "Invaild authentication token";

        next(new UnauthorizedError(message));
    }
};

const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new Error('No token provided');

        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

const authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!allowedRoles.some(role => req.user.roles.includes(role))) {
            return next(new ForbiddenError("Insufficient permissions"));
        }
        next();
    };
};

// special case for staff resource access
const staffResourceCheck = async (req, res, next) => {
    if (req.user.roles.includes('staff')) {
        const courtId = req.params.courtId || req.body.courtId;
        const isAuthorized = await authService.verifyStaffAccess(
            req.user.userId,
            courtId
        );

        if (!isAuthorized) return next(new ForbiddenError("Not authrize for this court"));
    }
    next();
};

module.exports = { protect, authenticate, authorize, staffResourceCheck };