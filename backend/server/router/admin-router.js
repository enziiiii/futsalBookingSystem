const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");

const adminController = require("../controllers/admin-controller");
const { validateCourt, validateUser } = require("../middlewares/inputValidator");
const courtController = require("../controllers/court-controller");
const userController = require("../controllers/user-controller");
const roleController = require("../controllers/role-controller");
const bookingController = require("../controllers/booking-controller");
const analyticsController = require("../controllers/analytics-controller");
const router = express.Router();



// -- Admin routes
// router.route("/admin-UserController").get(userController.getAllUsersController);
router.get("/admin-dashboard", protect, authorize(['admin']), adminController.getAdminDashboard);

// To create Court by Admin with zod input validaotr
router.post("/courts", protect, authorize(["admin"]), validateCourt('createCourtSchema'), courtController.createCourtController);

// To get all courts as Admin
router.get("/courts", protect, authorize(["admin"]), courtController.getAllCourtsController);

// To court by ID as Admin
router.get("/courts/:courtId", protect, authorize(["admin"]), courtController.getCourtByIdController);

// To update the court as Admin with zod input validator
router.put("/courts/:courtId", protect, authorize(["admin"]), validateCourt('updateCourtSchema'), courtController.updateCourtController);

// To delete court As Admin
router.delete("/courts/:courtId", protect, authorize(["admin"]), courtController.deleteCourtController);

// -- Admin-customer management routes
router.get("/users", protect, authorize(["admin"]), userController.getAllUsersController);

// router.get("/users", protect, authorize(["admin"]), roleController.getUsersByRoleController);

// To create User by Admin with zod input validator
router.post("/users", protect, authorize(["admin"]), validateUser('createUserSchema'), userController.createUserController);

// To update User by Admin with zod input validator
router.put("/users/:userId", protect, authorize(["admin"]), userController.updateUserController);

// To delete User by Admin with zod input validator
router.delete('/users/:userId', protect, authorize(['admin']), userController.deleteUserController);

// To get all bookings made by customers
router.get("/bookings", protect, authorize(["admin"]), bookingController.getAllBookingsController);

// --------- Admin-staff management routes





// -------- admin overseeing reports/analytics
// booking reports
router.get("/analytics/bookings", protect, authorize(["admin"]), analyticsController.getBookingAnalyticsController);

// to get all revenue
router.get("/analytics/revenue", protect, authorize(["admin"]), analyticsController.getRevenueAnalyticsController);

// for admin to get all court utilization analytics
router.get("/analytics/court-utilization", protect, authorize(["admin"]), analyticsController.getCourtUtilizationController);



// Admin-role management routes
router.put('/users/:userId/roles', protect, authorize(['admin']), userController.updateUserRoles)

// Admin getting role
router.get("/admin/users", protect, authorize(["admin"]), (req, res, next) => {
    console.log("Route handler reached for /admin/users");
    roleController.getUsersByRoleController(req, res, next);
});


module.exports = router;