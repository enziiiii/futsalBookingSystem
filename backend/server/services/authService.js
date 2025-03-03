const bcrypt = require("bcrypt");
const { allModels } = require("../models");
const { ValidationError, UserAlreadyExistsError, InternalServerError, UnauthorizedError } = require("../utils/customErrors");
const { generateToken } = require("../utils/jwt");


class AuthService {
    async registerUser({ username, fullName, email, password, phoneNumber }) {
        // Validate required fields
        if (!username || !fullName || !email || !password || !phoneNumber) {
            throw new ValidationError("Credentials are required");
        }

        // check email existence
        const existingUser = await allModels.userModel.getUserByEmail(email);
        if (existingUser) {
            throw new UserAlreadyExistsError("Email already registered");
        }

        try {
            // hash password
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);
            
            // Create user with only essential fiels
            const newUser = await allModels.userModel.createUser(
                username,
                fullName,
                email,
                passwordHash,
                phoneNumber
            );  

            const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
            if (!passwordRegex.test(password)) {
                throw new ValidationError("Password must be *+ chars with 1 uppercase and 1 special character");
            }
            // Assign default 'user' role
            await allModels.userModel.assignUserRole(newUser.user_id, 'user');



            // respond with filteredUser data
            return {
            userId: newUser.user_id,
            username: newUser.username,
            roles: ['user'],
            createdAt: newUser.created_at
            };
        } catch (error) {
            // handle databse errors (e.g., unique constraint violation)
            if (error.code === "23505") {
                const message = error.constraint.includes("email")
                    ? "Email"
                    : "Username";
                throw new UserAlreadyExistsError(`${message} already exists`);
            } else { 
                console.error("Database error:", error);
                throw new InternalServerError("Failed to create user", error);
            }
        }
    }

    async loginUser(email, password) {
        // Validate input
        if (!email || !password) {
            throw new ValidationError("Email and password are required");
        }

        /*
        // Find user by email
        const user = await allModels.userModel.getUserByEmail(email);
        if (!user || !user.password_hash) {
            throw new UnauthorizedError("Invaid email or password");
        }
            */

        // Find user by roles
        const user = await allModels.userModel.getUserByEmailWithRoles(email);
        if (!user || !user.password_hash) {
            throw new UnauthorizedError("Invaid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid){
            throw new UnauthorizedError("Invalid email or password");
        }

        // Generate JWT token
        const { accessToken, refreshToken } = generateToken({
            userId: user.user_id,
            email: user.email,
            roles: user.roles
        });

        return { 
            accessToken,
            refreshToken, 
            userId: user.user_id };
    }


    async isTokenRevoked(token) {
        try {
            const isRevoked = await allModels.tokenBlacklist.tokenExits(token);
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

module.exports = new AuthService();