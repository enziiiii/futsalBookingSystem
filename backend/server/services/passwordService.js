const { allModels } = require("../models");
const { ValidationError } = require("../utils/customErrors");
const tokenService = require("./tokenService");

class passwordService {
    async resetPassword(userId, newPassword) {
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

    isPasswordValid(password){
        const passwordRegex =  /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
        return passwordRegex.text(password);
    }

    async changePassword(userId, oldPassword, newPassword) {
        const user = await allModels.userModel.getUserById(userId);
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);

        if (!isPasswordValid) {
            throw new ValidationError('Old password is incorrect');
        }

        await this.resetPassword(userId, newPassword);
    }
}

module.exports = new passwordService();