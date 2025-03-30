const express = require("express");
const courtController = require("../controllers/court-controller");
const { protect, authorize } = require("../middlewares/authMiddleware");
const router = express.Router();


// public router for customer
router.get('/courts', protect, authorize(["customer"]), courtController.getAllCourtsController);
router.get('courts/available', protect, authorize(["customer"]), courtController);


module.exports = router;