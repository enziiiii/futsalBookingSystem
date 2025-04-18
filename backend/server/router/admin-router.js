const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");

const adminController = require("../controllers/admin-controller");
const { validateCourt, validateUser } = require("../middlewares/inputValidator");
const courtController = require("../controllers/court-controller");
const userController = require("../controllers/user-controller");
const roleController = require("../controllers/role-controller");
const router = express.Router();



// Admin routes
// router.route("/admin-UserController").get(userController.getAllUsersController);
router.get("/admin-dashboard", protect, authorize(['admin']), adminController.getAdminDashboard);


// Court management routes
router.post("/courts", protect, authorize(["admin"]), validateCourt('createCourtSchema'), courtController.createCourtController);
router.get("/courts", protect, authorize(["admin"]), courtController.getAllCourtsController);
// router.get("/courts", courtController.getAllCourtsController);

router.get("/courts/:courtId", protect, authorize(["admin"]), courtController.getCourtByIdController);
router.put("/courts/:courtId", protect, authorize(["admin"]), validateCourt('updateCourtSchema'), courtController.updateCourtController);
router.delete("/courts/:courtId", protect, authorize(["admin"]), courtController.deleteCourtController);

// Admin-customer management routes
router.get("/users", protect, authorize(["admin"]), userController.getAllUsersController);
// router.get("/users", protect, authorize(["admin"]), roleController.getUsersByRoleController);
router.post("/users", protect, authorize(["admin"]), validateUser('createUserSchema'), userController.createUserController);
router.put("/users/:userId", protect, authorize(["admin"]), userController.updateUserController);
router.delete('/users/:userId', protect, authorize(['admin']), userController.deleteUserController);

// Admin-staff management routes

// Admin getting role
router.get("/admin/users", protect, authorize(["admin"]), (req, res, next) => {
    console.log("Route handler reached for /admin/users");
    roleController.getUsersByRoleController(req, res, next);
});


module.exports = router;