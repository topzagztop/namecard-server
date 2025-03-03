const createError = require("../utils/createError");
const jwt = require("jsonwebtoken");
const prisma = require("../configs/prisma");

const authenticate = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization

    if(!authorization || !authorization.startsWith('Bearer ')) {
      return createError(401, "Unauthorized")
    }

    const token = authorization.split(" ")[1]
    if(!token) {
      return createError(401, "Unauthorized")
    }

    const payload = jwt.verify(token, process.env.SECRET_KEY)

    const foundUser = await prisma.user.findUnique({
      where: {
        id: payload.id
      }
    })

    const {password, email, ...userData} = foundUser

    req.user = userData

    next()

  } catch (err) {
    next(err);
  }
};

module.exports = authenticate;
