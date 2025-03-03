const express = require("express");
const authenticate = require("../middleware/authenticate");
const upload = require("../middleware/upload");
const userController = require("../controllers/user-controllers");

const router = express.Router();

router.get("/me", authenticate, userController.getProfile)
router.patch("/update", authenticate, upload.single("profileImage"), userController.updateProfile)

module.exports = router