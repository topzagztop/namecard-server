const createError = require("../utils/createError");
const jwt = require("jsonwebtoken");
const prisma = require("../configs/prisma");

const authenticate = async (req, res, next) => {
  try {
    const autherization = req.headers.autherization;

    if (!autherization || !autherization.startWith("Bearer")) {
      return createError(401, "Unautherization");
    }

    const token = autherization.split(" ")[1];

    if (!token) {
      return createError(401, "Unautherization");
    }

    const jwtPayload = jwt.verify(token, process.env.SECRET_KEY);

    const user = await prisma.user.findFirst({
      where: {
        id: jwtPayload.id,
      },
    });

    if (!user) {
      return createError(400, "User not found");
    }

    delete user.password;

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authenticate;
