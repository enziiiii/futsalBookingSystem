const { pool } = require("../config/db");
const { allModels } = require("../models");
const bookingModel = require("../models/booking-model");
const courtUnavailabilityModel = require("../models/courtUnavailability-model");
const paymentModel = require("../models/payment-model");
const handleResponse = require("../utils/handleResponse");


class staffController {

    async getStaffDashboard(req, res) {
        try {
            res
            .status(200)
            .send("hello welcome to staff page using controller");
    
        } catch (error) {
            console.error("Error in staff controller:", error);
            res.status(500).send("Internal Server Error");
        }
    };
    
    async getCustomersController(req, res) {
        try {
            const customers = await allModels.userModel.getUsersByRole('customer');
            handleResponse(res, 200, 'Customers retrieved', customers);
        } catch (error) {
            handleResponse(res, 500, 'Internal server error');
        }
    } 

    async getCustomerByIdController(req, res) {
        try {
            const { userId } = req.params;
            const customer = await allModels.userModel.getUserWithRolesById(userId);
            if (!customer || !customer.roles.includes('customer')) {
                return handleResponse(res, 404, 'Customer not found');
            }
            handleResponse(res, 200, 'Customer retrieved', customer);
        } catch (error) {
            handleResponse(res, 500, 'Internal server error');
        }
    }

    async updateCustomerController(req, res) {
        try {
            const { userId } = req.params;
            const updates = req.body;
            const customer = await allModels.userModel.updateUser(userId, updates);
            if (!customer || !customer.roles.includes('customer')) {
                return handleResponse(res, 404, 'Customer not found');
            }
            handleResponse(res, 200, 'Customer updated', customer);
        } catch (error) {
            handleResponse(res, 500, 'Internal server error');
        }
    };

    async deleteCustomerController(req, res) {
        try {
            const { userId } = req.params;
            const customer = await allModels.userModel.deleteUser(userId);
            if (!customer || !customer.roles.includes('customer')) {
                return handleResponse(res, 404, 'Customer not found');
            }
            handleResponse(res, 200, 'Customer deleted');
        } catch (error) {
            handleResponse(res, 500, 'Internal server error');
        }
    };

    async getBookingsController(req, res) {
        try {
            const { startDate, endDate, courtId, status } = req.body;
            const bookings = await bookingModel.getBookings(startDate, endDate, courtId, status);
            handleResponse(res, 200, 'Bookings retrieved', bookings);
        } catch (error) {
            console.error(error);
            handleResponse(res, 500, 'Internal server error');
        }   
    };

    async getBookingByIdController(req, res) {
        try {
            const { bookingId } = req.params;
            const booking = await bookingModel.getBookingById(bookingId);
            if (!booking) {
                return handleResponse(res, 404, 'Booking not found');
            }
            handleResponse(res, 200, 'Booking retrieved', booking);
        } catch (error) {
            handleResponse(res, 500, 'Internal server error');
        }
    };

    async updateBookingController(req, res) {
        try {
            const { bookingId } = req.params;
            const { start_time, end_time, court_id, status } = req.body;
            const userId = req.user.userId;
            const updates = { start_time, end_time, court_id, status, approved_by: status === 'confirmed' ? userId: null };
            const booking = await bookingModel.updateBooking(bookingId, updates);
            handleResponse(res, 200, 'Booking updated', booking);
        } catch (error) {
            handleResponse(res, 500, 'Internal server error');
        }
    };

    async cancelBookingController(req, res) {
        try {
            const { bookingId } = req.params;
            const { reason } = req.body;
            const userId = req.user.userId;
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                await bookingModel.cancelBooking(bookingId, reason, userId);
                const payment = await paymentModel.getPaymentByBookingId(bookingId);
                if (payment && payment.status === 'paid') {
                    await paymentModel.updatePaymentStatus(bookingId, 'refunded');
                }
                
                await client.query('COMMIT');
                handleResponse(res, 200, 'Booking canceled');
            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            } finally {
                client.release();
            }
        } catch (error) {
            handleResponse(res, 500, 'Internal server error');
        }
    }

    async getUnavailabilityController(req, res) {
        try {
            const { courtId } = req.params;
            const unavailability = await courtUnavailabilityModel.getUnavailabilityByCourt(courtId);
            handleResponse(res, 200, 'Unavailability retrieved', unavailability);
        } catch (error) {
            handleResponse(res, 500, 'Internal server error')
        }
    }

    async addUnavailabilityController(req, res) {
        try {
            const { courtId } = req.params;
            const { start_time, end_time, reason } = req.body;
            const userId = req.user.userId;
            const unavailability = await courtUnavailabilityModel.addUnavailability(courtId, start_time, end_time, reason, userId);
            handleResponse(res, 201, 'Unavailability added', unavailability);
        } catch (error) {
            handleResponse(res, 500, 'Internal server error');
        }
    }

    async updateUnavailabilityController(req, res) {
        try {
            const { unavailabilityId } = req.params;
            const updates = req.body;
            const userId = req.user.userId;
            const unavailability = await courtUnavailabilityModel.updateUnavailability(unavailabilityId, updates, userId);
            handleResponse(res, 200, 'Unavailability updated', unavailability);
        } catch (error) {
            handleResponse(res, 500, 'Internal server error');
        }
    }

    async deleteUnavailabilityController(req, res) {
        try {
            const { unavailabilityId } = req.params;
            await courtUnavailabilityModel.deleteUnavailability(unavailabilityId);
            handleResponse(res, 200, 'Unavailability deleted');
        } catch (error) {
            handleResponse(res, 500, 'Internal server error');
        }
    }

    async getStaffCourtsController(req, res) {
        try {
            const staffId = req.user.userId;
            const courts = await allModels.staffCourtModel.getCourtsByStaff(staffId);
            if (courts.length === 0) {
                return handleResponse(res, 404, 'No courts assigned to this staff');
            }
            handleResponse(res, 200, 'Courts retrieved', courts);
        } catch (error) {
            console.error('Error in getStaffCourtscontroller:', error);
            handleResponse(res, 500, 'Internal server error');
        }
    }

};

module.exports = new staffController();