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


router.route("/").get(authControllers.home);
router.route("/login").post(limiter, validateUser('loginSchema'), authControllers.login);
router.route("/logout").post(authControllers.logout);
router.route("/register").post(validateUser('registerSchema'),authControllers.register);


module.exports = router;