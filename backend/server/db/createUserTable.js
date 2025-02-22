const { pool } = require('../config/db');
// import pool from "../config/db.js";

const createUserTable = async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

    `;
    // const client = await pool.connect();
    try {
        // await client.query("BEGIN"); 

        await pool.query(queryText);

        // await client.query("COMMIT");
        console.log("User table created if not exists");
    } catch (error) {
        // await client.query("ROLLBACK");
        console.log("Error creating users table : ", error);
        throw error;
    } 
    // finally {
    //     client.release();
    // }
};

module.exports = createUserTable;