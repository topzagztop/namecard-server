const express = require("express")
const cardControllers = require("../controllers/card-controllers")
const authenticate = require("../middleware/authenticate")
const upload = require("../middleware/upload")

const router = express.Router()

router.post("/create", 
    upload.fields([{name: "logo", maxCount: 1}, {name: "businessProfile", maxCount: 1}]),
    authenticate, cardControllers.createCard)

module.exports = router