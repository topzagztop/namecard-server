const createError = require("../utils/createError");
const prisma = require("../configs/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return createError(404, "Email and Password are required");
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return createError(400, "Type of email and password should be string");
    }

    if (password.length < 8) {
      return createError(
        400,
        "Password length should be at least 8 charactors"
      );
    }

    const isUserExist = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!isUserExist) {
      return createError(400, "User allready exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.json({ message: "Register Successfully" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return createError(400, "Email and Password should be provideds");
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return createError(
      400,
      "Invalid typeof email and password should be provideds"
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return createError(400, "User not found");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return createError(400, "Email or Password is invalid");
  }

  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });

  res.json({ token });
};
