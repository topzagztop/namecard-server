const express = require("express")
const authenticate = require("../middleware/authenticate")
const themeController = require("../controllers/theme-controllers")

const router = express.Router()

router.get("/", authenticate, themeController.getTheme)

module.exports = router