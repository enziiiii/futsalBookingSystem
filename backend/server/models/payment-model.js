const { pool } = require("../config/db")

class PaymentModel {
    constructor(dbPool){
        this.pool = dbPool;
    }

    // as i have payment_status in both table so we need to sync them, so as if you update one table you should also update another table (Always update both in a single transaction)
    async confirmPayment(bookingId) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query(
                'UPDATE payments SET status = $1, updated_at = CUREENT_TIMESTAMP WHERE booking_id = $2',
                ['paid', bookingId]
            );

            await client.query('COMMIT');
            return { success: true };
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Payment confirmation failed: ${error.messsage}`);
        } finally {
            client.release();
        }
    }

    async getPaymentByBookingId(bookingId) {
        try {
            const query = {
                text: 'SELECT * FROM payments WHERE booking_id = $1',
                values: [bookingId],
            };
            const result = await this.pool.query(query);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Failed to fetch payment: ${error.message}`);
        }
    }

    async updatePaymentStatus(bookingId, newStatus) {
        const query = `
        UPDATE payments
        SET payment_status = $1, updated_at = NOW()
        WHERE booking_id = $2
        RETURNING *;
        `;

        const values = new [newStatus, bookingId];
        const result = await this.pool.query(query, values);
        return result.rows[0];
    }
};

module.exports = new PaymentModel();