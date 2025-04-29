const bookingModel = require("../models/booking-model");
const handleResponse = require("../utils/handleResponse");

class BookingController {
    async checkSlotAvailability(req, res, next) {
        // const { courtId } = req.params;
        const { court_id, start_time, end_time } = req.body;
        try {
            console.log('Received checkSlotAvailability data:', { court_id, start_time, end_time });
            if (!court_id || !start_time || !end_time) {
                return handleResponse(res, 400, 'Court Id, start time, end time are required')
            }
            const isAvailable = await bookingModel.checkSlotAvailability(court_id, start_time, end_time);
            handleResponse(res, 200, 'Slot availability checked', { available: isAvailable });
        } catch (error) {
            next(error);
        }
    }

    async createBooking(req, res, next) {
        const { court_id, start_time } = req.body;
        try {
            console.log("welcome to createBookings by controller", req.body);
            if (!court_id || !start_time) {
                return handleResponse(res, 400, 'Court Id and start Time are required');
            }

            if (!req.user || !req.user.userId) {
                return handleResponse(res, 401, 'Unauthorized: User not authenticated');
            }
            const bookingData = { customer_id: req.user.userId, court_id, start_time };
            const newBooking = await bookingModel.createBooking(bookingData);
            handleResponse(res, 201, 'Booking created successfully', newBooking);

        } catch (error) {
            next(error);
        }
    }

    async getBookedHours(req, res, next) {
        const { courtId } = req.params;
        const { date } = req.query;
        try {
            const bookedHours = await bookingModel.getBookedHoursByCourtAndDate(courtId, date);
            handleResponse(res, 200, 'Booked hours fetched successfully', bookedHours);
        } catch (error) {
            next(error);
        }
    }

    // by customer
    async confirmBooking(req, res, next) {
        const { bookingId } = req.params;
        try {
            console.log(`Confirm booking: ${bookingId}`);
            const confirmedBooking = await bookingModel.confirmBooking(bookingId);
            if (!confirmedBooking) {
                return handleResponse(res, 404, 'Booking not found or already confirmed', confirmedBooking);
            }
            return handleResponse(res, 200, 'Booking confirmed', confirmedBooking);
        } catch (error) {
            // next(error);
            console.error('confirmBooking error:', error.message);
            if (!res.headerSent) {
                return handleResponse(res, 500, `Failed to confirm booking: ${error.message}`);
            }

            console.warn('Headers already sent, skipping response');
        }
    }

    // by customer
    async cancelBooking(req, res, next) {
        const { bookingId } = req.params;
        const { reason } = req.body;
        try {
            const canceledBooking = await bookingModel.cancelBooking(bookingId, reason);
            if (!canceledBooking) {
                handleResponse(res, 404, 'Booking not found');
            }

            handleResponse(res, 200, 'Booking canceled', canceledBooking);
        } catch (error) {
            next(error);
        }
    }

    // by customer
    async getMybookingsController(req, res, next) {
        try {
            if (!req.user || !req.user.userId) {
                return handleResponse(res, 401, 'Unauthorized: User not authenticated');
            }

            const customerId = req.user.userId;
            const bookings = await bookingModel.getBookingsByCustomer(customerId);

            if (!bookings || bookings.length === 0) {
                return handleResponse(res, 404, 'No bookings found fot this customer');
            }

            handleResponse(res, 200, 'Bookings fetch successfully', bookings);
        } catch (error) {
            next(error);
        }
    }

    // by staff abnd admin
    async getAllBookingsController(req, res, next) {
        const { startDate, endDate, courtId, status } = req.query;
        try {
            const filters = { startDate, endDate, courtId, status };
            const bookings = await bookingModel.getBookings(filters);
            handleResponse(res, 200, 'All bookings fetched successfully', bookings);
        } catch (error) {
            next (error);
        }
    }

    // by staff
    async updateBookingController(req, res, next) {
        const { bookingId } = req.params;
        const updates = req.body;
        try {
            const updatedBooking = await bookingModel.upateBooking(bookingId, updates);
            if (!updatedBooking) {
                return handleResponse(res, 404, 'Booking not found');
            }
            handleResponse(res, 200, 'Booking updated successfully', updatedBooking);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new BookingController();