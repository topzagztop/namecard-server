const createError = require("../utils/createError")

exports.register = (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        createError(404, "Email and Password are required");
      }

      res.json({ message: "Register Successfully"})
    } catch (error) {
      next(error);
    }
}

exports.login = (req, res, next) => {
    res.json({message: "Login"})
}