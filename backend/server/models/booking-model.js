const { pool } = require('../config/db');

class BookingModel {
    constructor(dbPool) {
        this.pool = dbPool;
    }

    async checkSlotAvailability(courtId, start_time, end_time) {
        try {
            const query = {
                // text: "SELECT COUNT (*) FROM bookings WHERE court_id = $1 AND ($2 end_time AND $3 > start_time)",
                text: "SELECT COUNT (*) FROM bookings WHERE court_id = $1 AND (start_time < $3 AND end_time > $2)",
                values: [courtId, start_time, end_time]
            };

            const result = await this.pool.query(query);
            return result.rows[0].count === '0';
        } catch (error) {
            throw new Error(`Failed to check slot availability: ${error.message}`);
        }
    }

    async createBooking(bookingData) {
        try {
            const { customer_id, court_id, start_time } = bookingData;
            console.log('Received bookingData in model:', { customer_id, court_id, start_time });
         
            if (!customer_id || !court_id || !start_time) {
                throw new Error('Missing required fields: customer_id, court_id, start_time')
            }

            const startDate = new Date(start_time);
            if (isNaN(startDate)) {
                throw new Error('Invalid start_time format');
            }

            const endDate = new Date(startDate);
            endDate.setHours(endDate.getHours() + 1);    // Add 1 hour in booking
            const query = {
                text: "INSERT INTO bookings (customer_id, court_id, start_time, end_time) VALUES ($1, $2, $3 AT TIME ZONE 'UTC', $4 AT TIME ZONE 'UTC') RETURNING *",
                values: [customer_id, court_id, startDate.toISOString(), endDate.toISOString()]
            };

            const result = await this.pool.query(query);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Failed to create booking: ${error.message}`);
        }
    }


    async getBookedHoursByCourtAndDate(courtId, date) {
        try {
            const query = {
                text: "SELECT DISTINCT DATE(start_time) AS book_date, EXTRACT(HOUR FROM start_time) AS hour FROM bookings WHERE court_id = $1 AND DATE(start_time) = $2",
                values: [courtId, date]
            };

            const result = await this.pool.query(query);
            return result.rows.map(row => row.hour);
        } catch (error) {
            throw new Error(`Failed to fetch booked hours: ${error.message}`);
        }
    }


    async confirmBooking(bookingId) {
       try {
        const parsedBookingId = parseInt(bookingId, 10);
        if (isNaN(parsedBookingId)) {
            throw new Error('Invalid booking_id');
        }
        const query = {
            text: "UPDATE bookings SET status = 'confirmed', payment_status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE booking_id = $1 AND status = 'pending' RETURNING *",
            values: [parsedBookingId],
        };

        console.log('confirming confirmBooking query with bookingId:', parsedBookingId);
        const result = await this.pool.query(query);
        return result.rows[0];
       
        } catch (error) {
            console.error('confirmBooking error:', error.message);
            throw new Error(`Failed to confrim booking: ${error.message}`);
        }
    }

    async cancelBooking(bookingId, reason) {
        const query = {
            text: "UPDATE bookings SET status = 'canceled', cancellation_timestamp = CURRENT_TIMESTAMP, cancellation_reason = $1 WHERE booking_id = $2 RETURNING *",
            values: [reason || 'No reason provided', bookingId],
        };

        const result = await this.pool.query(query);
        return result.rows[0];
    }

    async getPendingBookingOlderThan(time) {
        try {
            const query = {
                text: "SELECT * FROM bookings WHERE status = 'pending' AND created_at <$1",
                values: [time.toISOString()]
            };

            const result = await this.pool.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Failed to fetch pending bookings: ${error.message}`);
        }
    }


    async getBookingsByCustomer(customerId) {
        try {
            const parsedCustomerId = parseInt(customerId, 10);
            if (isNaN(parsedCustomerId)) {
                throw new Error('Invalid customer ID');
            }

            const query = {
                text: "SELECT * FROM bookings WHERE customer_id = $1",
                values: [parsedCustomerId]
            };

            const result = await this.pool.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Failed to fetch bookings: ${error.message}`);
        }
    }
}

module.exports = new BookingModel(pool);