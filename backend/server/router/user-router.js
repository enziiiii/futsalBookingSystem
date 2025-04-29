const express = require("express");
const userController = require("../controllers/user-controller");

const { validateUser } = require("../middlewares/inputValidator");

const router = express.Router();

// User Registration Route with zod input validator
router.post("/", validateUser('registerSchema'), userController.createUserController);

// To get all User Route
router.get("/", userController.getAllUsersController);

// To get User by Id
router.get("/:userId", userController.getUserByIdController);

// To update User by Id
router.put("/:userId", userController.updateUserController);

// To Delete User by Id
router.delete("/:userId", userController.deleteUserController);

module.exports = router;


// router.get("/profile", renewAccessToken, protect, userController.getProfile); // need to make a 


// admin or staffs
// router.post("/courts", authorize(['admin', 'staff'], userController.courtController));
