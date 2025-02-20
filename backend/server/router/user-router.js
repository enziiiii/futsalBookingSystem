const express = require("express");
const userController = require("../controllers/user-controller");

const router = express.Router();

router.post("/", userController.createUserController);
router.get("/", userController.getAllUsersController);
router.get("/:id", userController.getUserByIdController);
router.put("/:id", userController.updateUserController);
router.delete("/:id", userController.deleteUserController);

module.exports = router;