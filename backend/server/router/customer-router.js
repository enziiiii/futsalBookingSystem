const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");
const courtController = require("../controllers/court-controller");
const bookingController = require("../controllers/booking-controller");
const router = express.Router();

// create a new booking
router.post("/bookings", protect, authorize(['customer']), bookingController.createBooking);

// fetching Bookings
// router.get('/bookings/:customerId', protect, authorize(['customer']), bookingController.fetchBookings);

// fetch bookings
router.get('/bookings', protect, authorize(['customer']), bookingController.getMybookingsController)

// get all courts
router.get("/courts", protect, authorize(['customer']), courtController.getAllCourtsForCustomersController);

// get all available courts
router.get("/courts/available", protect, authorize(['customer']), courtController.getAvailableCourtController);

// Check availability of a specific time slot for a court
router.post("/courts/checksSlotAvailability",  protect, authorize(['customer']), bookingController.checkSlotAvailability);

// Check availability of a specific time slot for a court
router.post("/bookings/check-availability",  protect, authorize(['customer']), bookingController.checkSlotAvailability);

// get booked hours for a specific court on a specific date
router.get("/courts/:courtId/booked-hours", protect, authorize(['customer']), bookingController.getBookedHours);

// confirm booking
router.put('/bookings/:bookingId/confirm', protect, authorize(['customer']), bookingController.confirmBooking);

// cancel booking
router.put('/bookings/:bookingId/cancel', protect, authorize(['customer']), bookingController.cancelBooking);

module.exports = router;