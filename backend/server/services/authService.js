const bcrypt = require("bcrypt");
const { allModels } = require("../models");
const { ValidationError, UserAlreadyExistsError, InternalServerError } = require("../utils/customErrors");

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

            // respond with filteredUser data
            return {
            id: newUser.user_id,
            username: newUser.username,
            createdAt: newUser.created_at
            };
        } catch (error) {
            // handle databse errors (e.g., unique constraint violation)
            if (error.code === "23505") {
                const message = error.constraint.includes("email")
                    ? "Email already registered"
                    : "Username already taken";
                throw new UserAlreadyExistsError(message);
            } else { 
                console.error("Database error:", error);
                throw new InternalServerError("Failed to create user", error);
            }
        }
    }
}

module.exports = new AuthService();