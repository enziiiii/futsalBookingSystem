const express = require("express");
const rateLimit = require('express-rate-limit');
const router = express.Router();

const authControllers = require("../controllers/auth-controller");
const { validateUser } = require("../middlewares/inputValidator");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 6, // login/regiter attempts
    message: "Too many attempts, please try again later"
});

// Home Route
router.route("/").get(authControllers.home);

// Login Route
router.route("/login").post(limiter, validateUser('loginSchema'), authControllers.login);

// Logout Route
router.route("/logout").post(authControllers.logout);

// Register Route
router.route("/register").post(validateUser('registerSchema'),authControllers.register);


module.exports = router;