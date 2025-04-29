const express = require("express");
const { protect, authorize, staffCourtAccess } = require("../middlewares/authMiddleware");
const userController = require("../controllers/user-controller");
const staffController = require("../controllers/staff-controller");
const { validateUser } = require("../middlewares/inputValidator");

const analyticsController = require("../controllers/analytics-controller");
const courtController = require("../controllers/court-controller");
const bookingController = require("../controllers/booking-controller");

const router = express.Router();

router.use(protect, authorize(['staff']));

// To staff dashboard
router.get("/staff-dashboard", protect, authorize(['staff']), staffController.getStaffDashboard);

// To update User by staff with zod input validator
router.put("/users/:userId", protect, authorize(["staff"]), validateUser('updateUserSchema'), userController.updateUserController);

// to manage customer as staff
router.route("/customers").get(staffController.getCustomersController);

router.route("/customers/:customerId").get(staffController.getCustomerByIdController)
                                    .put(staffController.updateCustomerController)
                                    .delete(staffController.deleteCustomerController);

//  to get all booking as staff
router.route("/bookings").get(staffController.getBookingsController);

// to manage a certain booking as staff
router.route("/bookings/:bookingId").get(staffController.getBookingByIdController)
                                    .put(staffController.updateBookingController)
                                    .delete(staffController.cancelBookingController);

// to get all courts
router.get("/courts", protect, authorize(["staff"]), staffController.getStaffCourtsController);

// Booking analytics
router.get("/analytics/bookings/:courtId", protect, authorize(["staff"]), staffCourtAccess, analyticsController.getBookingAnalyticsController);

// Revenue analytics
router.get("/analytics/revenue/:courtId",protect, authorize(["staff"]), staffCourtAccess, analyticsController.getRevenueAnalyticsController);

// Court Utilization analytics
router.get("/analytics/court-utilization/:courtId", staffCourtAccess, analyticsController.getCourtUtilizationController);

// to manage unavailability courts
router.route("/courts/:courtId/unavailability").get(staffController.getUnavailabilityController)
                                                .post(staffController.addUnavailabilityController);


// to manage a certain unvailability court
router.route("/courts/:courtId/unavailability/:unavailabilityId").put(staffController.updateUnavailabilityController)
                                                                .delete(staffController.deleteUnavailabilityController);
    

// assigned staff to update assigned court                                                                
router.route("/courts/:courtId").put(staffCourtAccess, courtController.updateCourtController);

// assigned staff to updated assigned court booking
router.put("/courts/:courtId/bookings/:bookingId", staffCourtAccess, staffController.updateBookingController);





module.exports = router;