const { pool } = require('../config/db');

const createTokenBlacklistTable = async () => {
    const queryText = `
        CREATE TABLE IF NOT EXISTS token_blacklist (
        id SERIAL PRIMARY KEY,
        token TEXT NOT NULL UNIQUE, 
        expires_at TIMESTAMPZ NOT NULL,  
        created_at TIMESTAMPZ DEFAULT now()
)
    `;
    try {
        await pool.query(queryText);
        console.log("Token Blacklist table created if not exists");
    } catch {
        console.log("Error creating Token Blacklist table : ", error);
        throw error;
    }
};

module.exports = createTokenBlacklistTable;