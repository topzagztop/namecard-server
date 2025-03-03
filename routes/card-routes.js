const express = require("express")
const cardControllers = require("../controllers/card-controllers")
const authenticate = require("../middleware/authenticate")
const upload = require("../middleware/upload")

const router = express.Router()

router.get("/me", authenticate, cardControllers.getListCard)
router.post("/create", 
    upload.fields([{name: "logo", maxCount: 1}, {name: "businessProfile", maxCount: 1}]),
    authenticate, cardControllers.createCard)
router.patch("/editnamecard/:id",
    upload.fields([{name: "logo", maxCount: 1}, {name: "businessProfile", maxCount: 1}]),
    authenticate, cardControllers.editCard)
router.delete("/:id", authenticate, cardControllers.deleteCard)
router.get("/:id", authenticate, cardControllers.getCardById)


module.exports = router