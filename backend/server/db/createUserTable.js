const { pool } = require('../config/db');
// import pool from "../config/db.js";

const createUserTable = async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100),
    username VARCHAR UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
    `;
    try {
        await pool.query(queryText);
        console.log("User table created if not exists");
    } catch (error) {
        console.log("Error creating users table : ", error);
        throw error;
    } 
};

module.exports = createUserTable;