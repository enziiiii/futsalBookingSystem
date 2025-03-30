const { pool } = require("../config/db")
class Password {
    async updatePassword(userID, passwordHash) {
        const query = `
            UPDATE users
            SET password_hash = $1
            WHERE user_id = $2
        `;
        await pool.query(query, [passwordHash, userId]);
    }

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