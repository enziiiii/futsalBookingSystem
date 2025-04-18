const { allModels } = require("../models");
const { AppError } = require("../utils/customErrors");
const { verifyToken, signPayLoad } = require("../utils/jwt");
const jwt = require("jsonwebtoken");


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

    // creates both access and refresh tokens during initial login/registration
    generateTokens(user) {
        // console.log('User object for token generation:', user);
        if (!user.user_id) {
            console.error('User object missing user_id:', user);
            throw new Error('Cannot generate token: user_id missing');
        }

        const accessPayload = {
            userId: user.user_id, // From users table
            email: user.email,
            roles: user.roles // Array from user_roles join
        };
        console.log('Access token payload:', accessPayload);
        return {
            accessToken: signPayLoad(
                accessPayload,
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
            ),
        
            refreshToken: signPayLoad(
                { userId: user.user_id, tokenVersion: user.token_version }, 
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
            )
        };
    }

    // handles access token renewal in isolation
    generateAccessToken(user) {
        return signPayLoad(
            {
                userId: user.user_id,
                email: user.email,
                roles: user.roles
            },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
        );
    }

    // handles refresh token renewal in isolation
    generateRefreshToken(user) {
        return signPayLoad(
            { 
                userId: user.user_id, 
                tokenVersion: user.token_version
            },

            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
        );
    }

    // verification methods
    verifyAccessToken(token) {
        try {
            return verifyToken(token, process.env.JWT_ACCESS_SECRET);
        } catch (error) {
            throw new Error('Invalid access token: ' + error.message);
        }
    }

    async verifyRefreshToken(token) {
        // try {
        //     return verifyToken(token, process.env.JWT_REFRESH_SECRET);
        // } catch (error) {
        //     throw new Error('Invalid refresh token: ' + error.message);
        // }

        try {
            const decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET);
            const user = await allModels.userModel.getUserById(decoded.userId);

            if (!user) throw new AppError('UserNotFound', 404);
            if (decoded.tokenVersion !== user.token_version) {
                throw new AppError('TokenRevoked', 401);
            }
            return decoded;
        } catch (error) {
            throw new AppError('InvalidRefreshToken', 401, error.message);
        }
    }


    async isTokenRevoked(token) {
        try {
            const isRevoked = await allModels.tokenBlacklist.tokenExists(token);
            return isRevoked;
        } catch (error) {
            console.error("Token revocation check failed:", error);
            throw new AppError("InternalServerError", 500, "Failed to verify token status");
        }
    }

    async revokeToken(token, expiresAt) {
        try {
            await allModels.tokenBlacklist.addToken(token, new Date(expiresAt * 1000));
        } catch (error) {
            console.error("Failed to revoke token:", error);
            throw new AppError("InternalServerError", 500, "Failed to revoke token");
        }
    }
}

module.exports = new TokenService();