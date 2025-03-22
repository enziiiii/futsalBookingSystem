const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");
const adminController = require("../controllers/admin-controller");
const { getAllUsers } = require("../models/user-model");
const { validateCourt } = require("../middlewares/inputValidator");
const courtController = require("../controllers/court-controller");

const router = express.Router();

// Admin routes
router.route("/users").get(getAllUsers);
router.get("/admin-dashboard", protect, authorize(['admin']), adminController.getAdminDashboard);

// Court management routes
router.post("/courts", authorize(["admin"]), validateCourt('createCourtSchema'), courtController.createCourtController);
router.get("/courts", authorize(["admin"]), courtController.getAllCourtController);
router.get("/courts/:courtId", authorize(["admin"]), courtController.getCourtByIdController);
router.put("/courts/:courtId", authorize(["admin"]), validateCourt('updateScourtSchema'), courtController.updateCourtController);
router.delete("/courts/:courtId", authorize(["admin"]), courtController.deleteCourtController);

module.exports = router;