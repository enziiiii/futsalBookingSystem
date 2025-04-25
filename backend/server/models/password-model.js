const { pool } = require("../config/db");
const { getUserById } = require("./user-model");
class Password {
    async updatePassword(userId, { oldPassword, newPassword }) {
        const user = await getUserById(userId);
        if (!user) throw new Error("User not found");

        if (oldPassword) {
            const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
            if (!isMatch) throw new Error("Incorrect current password");
        }

        // hash the new password
        const hashedNewPasssword = await bxrypt.hash(newPassword, 10);

        // udpate the passwordHash field in the database
        await pool.query(
            "UPDATE users SET password_hash = $1 WHERE user_id = $2",
            [hashedNewPasssword, userId]
        );

        return { messsage: "Password updated successfully" };
    };


    async incrementTokenVersion(userId){
        const query =  `
            UPDATE users
            SET token_version = token_version + 1
            WHERE user_id = $1
        `;
        await pool.query(query, [userId]);
    }
}

module.exports = new Password();