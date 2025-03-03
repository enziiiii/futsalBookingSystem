const { pool } = require('../config/db');

const createUserRoleTable = async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS user_roles (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(role_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
)
    `;
    try {
        await pool.query(queryText);
        console.log("User-Role table created if not exists");
    } catch {
        console.log("Error creating user-role table : ", error);
        throw error;
    }
};

module.exports = createUserRoleTable;



