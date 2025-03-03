const express = require("express");
const contactControllers = require("../controllers/contact-controllers");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/add", authenticate, contactControllers.addContact);
// router.get("/list", authenticate, contactControllers.getContacts);
// router.delete("/delete/:id", authenticate, contactControllers.deleteContact);

module.exports = router;
