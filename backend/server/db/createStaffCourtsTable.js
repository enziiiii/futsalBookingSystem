const { pool }  = require('../config/db');

const createStaffCourtsTable = async() => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS staff_courts (
    staff_id INT REFERENCES users(user_id),
    court_id INT REFERENCES courts(court_id),
    PRIMARY KEY (staff_id, court_id)
    )
    `;

    try {
        await pool.query(queryText);
        console.log("staff_courts table created if not exists");
    } catch (error) {
        console.log("Error creating staff_courts table:", error);
        throw error;
    }
};

module.exports = createStaffCourtsTable;