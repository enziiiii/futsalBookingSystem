const express = require("express");
const userController = require("../controllers/user-controller");

const { protect, authorize, renewAccessToken } = require("../middlewares/authMiddleware");
const { validateUser } = require("../middlewares/inputValidator");

const router = express.Router();

router.post("/", validateUser('registerSchema'), userController.createUserController);
router.get("/", userController.getAllUsersController);
router.get("/:userId", userController.getUserByIdController);
router.put("/:userId", userController.updateUserController);
router.delete("/:userId", userController.deleteUserController);

// router.get("/profile", renewAccessToken, protect, userController.getProfile); // need to make a 


// admin or staffs
// router.post("/courts", authorize(['admin', 'staff'], userController.courtController));

module.exports = router;