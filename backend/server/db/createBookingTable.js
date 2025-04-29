const { pool } = require('../config/db');

const createBookingTable = async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS bookings(
    booking_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    court_id INT REFERENCES courts(court_id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    total_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(20) DEFAULT NULL,
    cancellation_timestamp TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    approved_by INT REFERENCES users(user_id),
    canceled_by INT REFERENCES users(user_id),
    CONSTRAINT chk_booking_times CHECK (end_time > start_time)
    )
    `;
    try {
        await pool.query(queryText);
        console.log("Booking table created if not exists");
    } catch (error) {
        console.log("Error creating Booking table: ", error);
        throw error;
    }
}

module.exports = createBookingTable;