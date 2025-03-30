const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");

const adminController = require("../controllers/admin-controller");
// console.log(adminController);

// const { getAllUsers } = require("../models/user-model");
const { validateCourt } = require("../middlewares/inputValidator");
const courtController = require("../controllers/court-controller");
const userController = require("../controllers/user-controller");
const router = express.Router();


// Admin routes
router.route("/admin-UserController").get(userController.getAllUsersController);
router.get("/admin-dashboard", protect, authorize(['admin']), adminController.getAdminDashboard);


// Court management routes
router.post("/courts", protect, authorize(["admin"]), validateCourt('createCourtSchema'), courtController.createCourtController);
router.get("/courts", protect, authorize(["admin"]), courtController.getAllCourtsController);
// router.get("/courts", courtController.getAllCourtsController);

router.get("/courts/:courtId", protect, authorize(["admin"]), courtController.getCourtByIdController);
router.put("/courts/:courtId", protect, authorize(["admin"]), validateCourt('updateCourtSchema'), courtController.updateCourtController);
router.delete("/courts/:courtId", protect, authorize(["admin"]), courtController.deleteCourtController);

module.exports = router;