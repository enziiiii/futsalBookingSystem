const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { allModels } = require("../models");
const { ValidationError, UserAlreadyExistsError, InternalServerError, UnauthorizedError } = require("../utils/customErrors");
const tokenService = require("./tokenService");


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

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
        if (!passwordRegex.test(password)) {
            throw new ValidationError("Password must be 8+ chars with 1 uppercase and 1 special character");
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

            
            // Assign default 'user' role
            await allModels.userModel.assignUserRole(newUser.user_id, 'customer');

            // respond with filteredUser data
            return {
            userId: newUser.user_id,
            username: newUser.username,
            roles: ['customer'],
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
        if (!user.roles || !user.password_hash) {
            throw new UnauthorizedError("Invaid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid){
            throw new UnauthorizedError("Invalid email or password");
        }

        await allModels.passwordModel.incrementTokenVersion(user.user_id);

        // // Generate JWT token
        // const { accessToken, refreshToken } = generateToken({
        //     userId: user.user_id,
        //     email: user.email,
        //     roles: user.roles
        // });

        // using tokenService instead of generateToken
        const tokens = tokenService.generateTokens({
            userId: user.user_id,
            email: user.email,
            roles: user.roles,
            token_version: user.token_version
        });

        return { 
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            userId: user.user_id 
        };
    }
}

module.exports = new AuthService();