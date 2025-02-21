require('dotenv').config()

// import
const express = require("express");
const cors = require("cors")
const morgan = require('morgan');
const errorHandler = require("./middleware/error")
const notFoundHandler = require("./middleware/not-found");

// import Router
const authRouter = require('./routes/auth-routes');
const userRouter = require("./routes/user-routes");

// express setting
const app = express();
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// Router
app.use("/auth", authRouter)
app.use("/user", userRouter)
app.use("/card", (req, res) => {
    res.json({message: "Open namecard of bussiness"})
})
app.use("/contacts-list", (req, res) => {
    res.json({message: "Social link of facebook & instagram & whatsapp & messenger & line"})
})

// Error Case
app.use(errorHandler)
app.use(notFoundHandler)

// open port server
app.listen("8000", ()=> console.log('Server is running on port 8000'))
