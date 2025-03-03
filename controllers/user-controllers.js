const cloudinary = require("../configs/cloudinary");
const fs = require("fs");
const prisma = require("../configs/prisma")

exports.getProfile = (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    next(err)
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, jobPosition, phone } = req.body

    const profileImage = req.file
      ? await cloudinary.uploader.upload(req.file.path)
      : null;

    const toUpdateInputs = {
      firstName,
      lastName,
      jobPosition,
      phone,
      profileImage: profileImage?.secure_url
    }

    for (let key in toUpdateInputs) {
      if (!toUpdateInputs[key]) {
        delete toUpdateInputs[key];
      }
    }

    const updateUser = await prisma.user.update({
      where: {
        id: req.user.id
      },
      data: {
        ...toUpdateInputs,
      }
    })

    res.json({ user: updateUser });

  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};
