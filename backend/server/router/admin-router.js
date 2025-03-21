const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");
const adminController = require("../controllers/admin-controller");

const router = express.Router();

router.get("/admin-dashboard", protect, authorize(['admin']), adminController.getAdminDashboard);

module.exports = router;