// this file is for all router in one place
// we can directly write in server.js but it would make server.js more traffic code in one place
const express = require("express");
const router = express.Router();

const authRouter = require("./auth-router.js");
const userRouter = require("./user-router");
const adminRouter = require("./admin-router.js");
const staffRouter = require("./staff-router.js");
const customerRouter = require("./customer-router.js");

// Use sub-routers
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/admin", adminRouter);
router.use("/staff", staffRouter);
router.use("/customer", customerRouter);

module.exports = router;