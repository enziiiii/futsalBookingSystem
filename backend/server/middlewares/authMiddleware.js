const { allModels } = require("../models");
const authService = require("../services/authService");
const tokenService = require("../services/tokenService");
const { clearRefreshTokenCookie, setRefreshTokenCookie } = require("../utils/cookieHelper");
const { UnauthorizedError, ForbiddenError } = require("../utils/customErrors");


const protect = async (req, res, next) => {
    console.log('Protect middleware hit');
    const token = req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null;
    
    console.log('Token from request:', token);
    if (!token) {
        return next(new UnauthorizedError("Authentication required"));
    }

    try {
        // verify and decode token
        const decoded = tokenService.verifyAccessToken(token);
        console.log('Decoded token:', decoded);
        req.user = decoded;

        // check token revocation
        const isRevoked = await tokenService.isTokenRevoked(token);
        if (isRevoked) {
            throw new UnauthorizedError("Session expired");
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
            : "Invalid authentication token";

        next(new UnauthorizedError(message));
    }
};

// const authenticate = (req, res, next) => {
//     try {
//         const token = req.headers.authorization?.split(' ')[1];
//         if (!token) throw new Error('No token provided');

//         const decoded = verifyAccessToken(token);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({ error: error.message });
//     }
// };

const authorize = (allowedRoles = []) => {
    return async (req, res, next) => {
        console.log('Authorize middleware hit');
        console.log('User from request:', req.user);
        console.log('User ID:', req.user.userId);
        console.log('Token Roles:', req.user.roles); // From JWT
        console.log('Allowed Roles:', allowedRoles);

        // if (!allowedRoles.some(role => req.user.roles.includes(role))) {
        //     return next(new ForbiddenError("Insufficient permissions"));
        // }

        if (!req.user?.userId) {
            return next(new UnauthorizedError("Not authenticated"));
        }

        // Fetch user roles from DB
        const userWithRoles = await allModels.userModel.getUserWithRolesById(req.user.userId);
        console.log('user roles from DB: ', userWithRoles?.roles)
        
        const currentRoles = userWithRoles?.roles || [];

        if (allowedRoles.length === 0) {
            // renewAccessToken.user.roles = currentRoles;
            req.user.roles = currentRoles;
            return next();
        }

        // checks role hierarchy
        const roleHierarchy = {
            admin: ['admin', 'staff', 'customer'],
            staff: ['staff', 'customer'],
            customer: ['customer']
        };

        // checks if any of the user's roles have sufficient privileges
        const hasPermission = currentRoles.some(role => 
            allowedRoles.some(allowedRole => 
                roleHierarchy[role]?.includes(allowedRole)
            )
        );

        if (!hasPermission) {
            return next(new ForbiddenError("Insufficient permissions"));
        }

        // attach fresh roles to request
        req.user.roles = currentRoles;
        next();
    };
};

// renewAccessToken is for renewing the access token using the refresh token (stored in cookies).
const renewAccessToken = async (req, res, next) => {
    const refreshToken  = req.cookies.refreshToken;
    if (!refreshToken) return next(); // No refresh token -> proceed

    try {
        // verify refresh token (throws error if invalid)
        const decoded = tokenService.verifyRefreshToken(refreshToken);

        const user = await allModels.userModel.getUserWithRolesById(decoded.userId);

        // Revoke old tokens
        await tokenService.revokeToken(refreshToken, decoded.exp);

        // Generate new access token with updated roles (if needed)
        const newAccessToken = tokenService.generateAccessTokens({
            userId: user.user_id,
            email: user.email,
            roles: user.roles
        });

        const newRefreshToken = tokenService.generateRefreshToken(user);

        res.set('New-Access-Token', newAccessToken);
        setRefreshTokenCookie(res, newRefreshToken);
    } catch (error) {
        // Refresh token invalid/expired -> clear cookie
        console.error("Token renewal failed:", error.message);
        clearRefreshTokenCookie(res);
    }
    next();
};

// special case for staff resource access
const staffCourtAccess = async (req, res, next) => {
    try {
        const courtId = req.params.courtId;
        const staffId = req.user.userId;

        console.log('[Middleware] staffCourtAccess: staffId =', staffId, ', courtId =', courtId);

        const isAuthorized = await allModels.staffCourtModel.verifyStaffAccess(
            staffId,
            courtId
        );

        console.log('[Middleware] staffCourtAccess: isAuthorized =', isAuthorized);
    
        if (!isAuthorized) return next(new ForbiddenError("Not authorize for this court"));
    
        next();
    } catch (error) {
        console.error('[Middleware] staffCourtAccess error:', error);
        next(error);
    }
};

module.exports = { 
    protect, 
    authorize, 
    renewAccessToken,
    staffCourtAccess
};