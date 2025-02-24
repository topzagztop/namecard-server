const createError = require("../utils/createError");
const prisma = require("../configs/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const fs = require("fs/promises")
const cloudinary = require("../configs/cloudinary")

exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    const isUserExist = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (isUserExist) {
      return createError(400, "User allready exist");
    }

    const profileImage = req.file
      ? await cloudinary.uploader.upload(req.file.path)
      : null;

    const hashedPassword = bcrypt.hashSync(password, 10);

    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        profileImage: profileImage?.secure_url,
      },
    });

    res.json({ message: "Register Successfully" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return createError(400, "User not found");
    }

    const isPasswordMatch = bcrypt.compareSync(password, user.password);

    if (!isPasswordMatch) {
      return createError(400, "Email or Password is invalid");
    }

    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    }

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: process.env.EXPIRES_IN,
    });

    res.json({
      message: "Login Success",
      payload: payload,
      token: token,
    });
  } catch (err) {
    next(err);
  }
};
