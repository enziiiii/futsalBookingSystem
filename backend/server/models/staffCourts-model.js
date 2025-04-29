const { pool } = require("../config/db")

const verifyStaffAccess = async(staffId, courtId) => {
    const query =`
    SELECT 1 FROM staff_courts
    WHERE staff_id = $1 AND court_id = $2
    `;

    const result = await pool.query(query, [staffId, courtId]);
    return result.rowCount > 0;  // True if assigned, false if not
}

const getCourtsByStaff = async(staffId) => {
    const query =`
        SELECT c.court_id, c.court_name
        FROM courts c
        JOIN staff_courts sc ON c.court_id = sc.court_id
        WHERE sc.staff_id = $1
    `;

    const { rows } = await pool.query(query, [staffId]);
    return rows;
}



module.exports = {
    verifyStaffAccess,
    getCourtsByStaff
}