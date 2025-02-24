const express = require("express");
const authControllers = require("../controllers/auth-controllers")
const {registerSchema, loginSchema, validateWithZod} = require("../middleware/validators")
const upload = require("../middleware/upload")

const router = express.Router();

router.post("/register", upload.single("profileImage"), validateWithZod(registerSchema), authControllers.register)
router.post("/login", validateWithZod(loginSchema) ,authControllers.login)

module.exports = router;
