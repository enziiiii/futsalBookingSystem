// this file is for all router in one place
// we can directly write in server.js but it would make server.js more traffic code in one place
const express = require("express");
const router = express.Router();

const authRouter = require("./auth-router.js");
const userRouter = require("./user-router.js");

// Use sub-routers
router.use("/auth", authRouter);
router.use("/user", userRouter);

module.exports = router;