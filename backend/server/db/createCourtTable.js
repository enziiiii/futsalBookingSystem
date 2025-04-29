const { pool } = require('../config/db');

const createCourtTable = async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS courts (
    court_id SERIAL PRIMARY KEY,
    court_name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    hourly_rate DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;
    try {
        await pool.query(queryText);
        console.log("Court table created if not exists");
    } catch (error) {
        console.log("Error creating Court table : ", error);
        throw error;
    } 
}

module.exports = createCourtTable;