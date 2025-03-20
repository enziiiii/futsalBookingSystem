const { allModels } = require("../models");
const authService = require("../services/authService");
const tokenService = require("../services/tokenService");
const { clearRefreshTokenCookie, setRefreshTokenCookie } = require("../utils/cookieHelper");
const { UnauthorizedError, ForbiddenError } = require("../utils/customErrors");


const protect = async (req, res, next) => {
    const token = req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null;
    
    if (!token) {
        return next(new UnauthorizedError("Authentication required"));
    }

    try {
        // verify and decode token
        const decoded = tokenService.verifyAccessToken(token);
        req.user - decoded;
        
        // check token revocation
        const isRevoked = await tokenService.isTokenRevoked(token);
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

        // if (!allowedRoles.some(role => req.user.roles.includes(role))) {
        //     return next(new ForbiddenError("Insufficient permissions"));
        // }

        if (!req.user) {
            return next(new UnauthorizedError("Not authenticated"));
        }

        const userWithRoles = await allModels.userModel.getUserWithRolesById(req.user.userId);
        const currentRoles = userWithRoles?.roles || [];

        if (allowedRoles.length === 0) {
            renewAccessToken.user.roles = currentRoles;
            return next();
        }

        // checks role hierarchhy
        const roleHierarchy = {
            admin: ['admin', 'staff'],
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
            return next(new ForbiddenError("Insufficient perissions"));
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
    if (!req.user.roles.includes('staff')) return next();

    const courtId = req.params.courtId || req.body.courtId;
    const isAuthorized = await authService.verifyStaffAccess(
        req.user.userId,
        courtId
    );

    if (!isAuthorized) return next(new ForbiddenError("Not authrize for this court"));

    next();
};

module.exports = { 
    protect, 
    authorize, 
    renewAccessToken,
    staffCourtAccess
};