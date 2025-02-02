require('dotenv').config()

// import
const express = require("express");
const cors = require("cors")
const errorHandler = require("./middleware/error")
const notFoundHandler = require("./middleware/not-found");


// import Router
const authRouter = require('./routes/auth-routes');
const userRouter = require("./routes/user-routes")

// express setting
const app = express();
app.use(cors())
app.use(express.json())

// Router
app.use("/auth", authRouter)
app.use("/user", userRouter)

// app.use("/namecard", (req, res) => {
//     res.json({message: "Open namecard of bussiness"})
// })

// app.use("/sociallink", (req, res) => {
//     res.json({message: "Social link of facebook & instagram & whatsapp & messenger & line"})
// })

// app.use("/theme" , (req, res) => {
//     res.json({message: "Theme of namecard"})
// })

// app.use("/contact", (req, res) => {
//     res.json({message: "You is Contact us"})
// })


// Error Case
app.use(errorHandler)
app.use(notFoundHandler)

// open port server
app.listen("8000", ()=> console.log('Server is running on port 8000'))
