const { pool } = require('../config/db');

const createRoleTable = async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
)
    `;
    try {
        await pool.query(queryText);
        console.log("Role table created if not exists");
    } catch (error) {
        console.log("Error creating role table : ", error);
        throw error;
    } 
};

module.exports = createRoleTable;

