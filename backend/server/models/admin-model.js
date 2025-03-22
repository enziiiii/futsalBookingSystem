const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const createAdminUser = async (username, fullName, emaul, passwordHash, phoneNumber) => {
    const userResult = await pool.query(
        `INSERT INTO users (username, full_name, email, password_hash, phone_number)
        VALUES ($1, $2, $3, $4, $5) RETURNING user_id`,
        [username, fullName, getUserByEmail, passwordHash,phoneNumber]
    );
    return userResult.rows[0].user_id;
};

const getAdminRoleId = async () => {
    const roleResult = await pool.query(
        `SELECT role_id FROM roles WHERE role_name = 'owner'`
    );
    return roleResult.rows[0].role_id;
};

module.exports = {
    createAdminUser,
    getAdminRoleId
}