const { pool } = require('../config/db');

class AnalyticsModel {
    constructor(dbPool) {
        this.pool = dbPool;
    }

    async getBookingAnalytics(courtId) {
        const query =`
        SELECT DATE_TRUNC('month', created_at) AS month, COUNT(*) as total_bookings
        FROM bookings
        WHERE status = 'confirmed' AND court_id = $1
        GROUP BY month
        ORDER BY month;
        `;

        const result = await this.pool.query(query, [courtId]);
        return result.rows;
    };

    async getRevenueAnalytics(courtId) {
        const query =`
        SELECT DATE_TRUNC('month', created_at) AS month, COALESCE(SUM(total_price), 0) AS total_revenue
        FROM bookings
        WHERE payment_status = 'paid' AND court_id = $1
        GROUP BY month
        ORDER BY month;
        `;

        const result = await this.pool.query(query, [courtId]);
        return result.rows;
    };

    async getCourtUtilization(courtId) {
        const query = `
            SELECT DATE_TRUNC('month', b.start_time) AS month,
                COALESCE(SUM(EXTRACT(EPOCH FROM (b.end_time - b.start_time))/3600), 0) AS total_hours
            FROM bookings b
            WHERE b.court_id = $1 AND b.status = 'confirmed'
            GROUP BY month
            ORDER BY month;
        `;

        const result = await this.pool.query(query, [courtId]);
        return result.rows;
    };

}

module.exports = new AnalyticsModel(pool)