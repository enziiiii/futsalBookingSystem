
class TokenService {
    constructor() {
        this.validateEnv();
    }

    validateEnv() {
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

    }


    generateTokens(user) {
        return {
            accessToken: jwt.signPayLoad(
                {
                    userId: user.user_id, // From users table
                    email: user.email,
                    roles: user.roles  // Array from user_roles join
                },
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
            ),
        
            refreshToken: jwt.signPayLoad(
                { 
                    userId: user.user_id 
                }, 
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
            )
        };
    }

    verifyAccessToken(token) {
        try {
            return jwt.verifyToken(token, process.env.JWT_ACCESS_SECRET);
        } catch (error) {
            throw new Error('Invalid access token: ' + error.message);
        }
    }

    verifyRefreshToken = (token) => {
        try {
            return jwt.verifyToken(token, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            throw new Error('Invalid refresh token: ' + error.message);
        }
    }

    async isTokenRevoked(token) {
        try {
            const isRevoked = await allModels.tokenBlacklist.tokenExists(token);
            return isRevoked;
        } catch (error) {
            console.error("Token revocation check failed:", error);
            throw new InternalServerError("Failed to verify token status");
        }
    }

    async revokeToken(token, expiresAt) {
        try {
            await allModels.tokenBlacklist.addToken(token, new Date(expiresAt * 1000));
        } catch (error) {
            console.error("Failed to revoke token:", error);
            throw new InternalServerError("Failed to revoke token");
        }
    }
}

module.exports = new TokenService();