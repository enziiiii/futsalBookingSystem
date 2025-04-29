const { pool } = require('../config/db')

const createCourtUnavailability = async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS court_availability(
    unavailability_id SERIAL PRIMARY KEY,
    court_id INT REFERENCES courts(court_id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES users(user_id),
    updated_by INT REFERENCES users(user_id),
    CONSTRAINT chk_unavailability_times CHECK (end_time > start_time)
    )
    `;

    try {
        await pool.query(queryText);
        console.log("Court Unavailability table created if not exists");
    } catch (error) {
        console.log("Error creating role table : ", error);
        throw error;
    }
};

module.exports = createCourtUnavailability;