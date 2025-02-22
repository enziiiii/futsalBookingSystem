const express = require("express");
const userController = require("../controllers/user-controller");

const router = express.Router();

router.post("/", userController.createUserController);
router.get("/", userController.getAllUsersController);
router.get("/:userId", userController.getUserByIdController);
router.put("/:userId", userController.updateUserController);
router.delete("/:userId", userController.deleteUserController);

module.exports = router;