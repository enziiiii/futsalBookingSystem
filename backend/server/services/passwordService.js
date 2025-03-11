const { allModels } = require("../models");
const { ValidationError } = require("../utils/customErrors");
const tokenService = require("./tokenService");

class passwordService {
    async resetPassword(usserId, newPassword) {
        // Validate new password strength
        if (!isPasswordValid(newPassword)) {
            throw new ValidationError("Invalid password");
        }

        // updated password and invalidate tokens
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await allModels.passwordModel.updatePassword(usserId, hashedPassword);
        await allModels.passwordModel.incrementTokenVersion(userId);

        // optional: logout all session by revoking tokens
        await tokenService.revokeToken(userId);

    }
}

module.exports = new passwordService();