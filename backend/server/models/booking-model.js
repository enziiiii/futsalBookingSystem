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
      try {
        const parsedBookingId = parseInt(bookingId, 10);
        if (isNaN(parsedBookingId)) {
            throw new Error('Invalid booking_id');
        }
        const query = {
            text: "UPDATE bookings SET status = 'canceled', cancellation_timestamp = CURRENT_TIMESTAMP, cancellation_reason = $1 WHERE booking_id = $2 RETURNING *",
            values: [reason || 'No reason provided', parsedBookingId],
        };

        const result = await this.pool.query(query);
        if (!result.rows[0]) {
            throw new Error('Booking not found');
        }
        return result.rows[0];
      } catch (error) {
        throw new Error(`Failed to cancel booking: ${error.message}`)
      }
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

    async getBookings(startDate, endDate, courtId, status) {
        try {   
            const query =`
            SELECT b.*, u.full_name AS customer_name, c.court_name
            FROM bookings b
            JOIN users u ON b.customer_id = u.user_id
            JOIN courts c ON b.court_id = c.court_id
            WHERE ($1::timestamp IS NULL OR b.start_time >= $1)
            AND ($2::timestamp IS NULL OR b.end_time <= $2)
            AND ($3::int IS NULL OR b.court_id = $3)
            AND ($4::varchar IS NULL OR b.status = $4)
            ORDER BY b.start_time;
            `;

            const values = [startDate || null, endDate || null, courtId || null, status || null]
            const result = await this.pool.query(query, values);
            return result.rows;
        } catch (error) {
            throw new Error(`Failed to get bookings: ${error.message}`);
        }
    }

    async upateBooking(bookingId, updates) {
        try {
            const parsedBookingId = parseInt(bookingId, 10);
            if (isNaN(parsedBookingId)) {
                throw new Error('Invalid bokking_id');
            }

            const fields = [];
            const values = [];
            let counter = 1;

            for (const [key, value] of Object.entries(updates)) {
                if (['start_time', 'end_time', 'court_id', 'status'].includes(key)) {
                    fields.push(`${key} = $${counter}`);
                    values.push(value);
                    counter++;
                }
            }

            if (fields.length === 0) {
                throw new Error('No valid fields to update');
            }

            values.push(parsedBookingId);
            const query =`
                UPDATE bookings
                SET ${fields.join(",")}, updated_at = CURRENT_TIMESTMP
                WHERE booking_id = $${counter}
                RETURNING *;
            `;

            const result = await this.pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Failed to updated booking: ${error.message}`);
        }
    }
}

module.exports = new BookingModel(pool);