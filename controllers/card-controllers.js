const prisma = require("../configs/prisma");
const { nanoid } = require("nanoid");
const QRCode = require("qrcode");
const cloudinary = require("../configs/cloudinary");
const createError = require("../utils/createError");

exports.createCard = async (req, res, next) => {
  try {
    const {
      businessName,
      position,
      businessTel,
      businessEmail,
      website,
      themeId,
      socialLinks,
    } = req.body;

    const logo = req.files
      ? await cloudinary.uploader.upload(req.files.logo[0].path)
      : null;

    const businessProfile = req.files
      ? await cloudinary.uploader.upload(req.files.businessProfile[0].path)
      : null;

    const userId = req.user.id;

    const slug = nanoid(10);

    const qrData = `${process.env.BASE_URL}/namecard/${slug}`;
    const qrCodeBuffer = await QRCode.toBuffer(qrData);

    const qrCodeUpload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "qrcode",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(qrCodeBuffer);
    });

    const result = JSON.parse(socialLinks);

    // validation

    const newCard = await prisma.nameCard.create({
      data: {
        businessName,
        position,
        businessTel,
        businessEmail,
        logo: logo?.secure_url,
        businessProfile: businessProfile?.secure_url,
        website,
        slug,
        qrcode: qrCodeUpload.secure_url,
        user: {
          connect: {
            id: userId,
          },
        },
        theme: {
          connect: {
            id: Number(themeId),
          },
        },
        socialLinked: {
          create:
            result?.map((link) => ({
              socialName: link.name,
              url: link.url,
            })) || [],
        },
      },
      include: {
        socialLinked: true,
      },
    });

    res.json({
      message: "Register Namecard Successful",
      namecard: newCard,
    });
  } catch (err) {
    next(err);
  }
};

exports.getListCard = async (req, res, next) => {
  try {
    const rs = await prisma.nameCard.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        userId: req.user.id,
      },
      include: {
        socialLinked: true,
        theme: true,
      },
    });

    if (!rs.length) {
      return createError(404, "No NameCards found");
    }

    res.json({ message: "Get List Namecard Successful", data: rs });
  } catch (err) {
    next(err);
  }
};

exports.getCardById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const nameCardId = await prisma.nameCard.findUnique({
      where: { id: Number(id) },
      include: { socialLinked: true, theme: true },
    });

    if (!nameCardId || nameCardId.userId !== req.user.id) {
      return createError(404, "NameCard not found or access denied");
    }

    res.json({ message: "Get NameCard Successful", data: nameCardId });
  } catch (err) {
    next(err);
  }
};

exports.editCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      businessName,
      position,
      businessTel,
      businessEmail,
      website,
      themeId,
      socialLinks,
    } = req.body;

    const nameCardData = await prisma.nameCard.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        socialLinked: true,
      },
    });

    if (!nameCardData || req.user.id !== nameCardData.userId) {
      return createError(400, "Cannot edit this NameCard");
    }

    const logo = req.files?.logo
      ? await cloudinary.uploader.upload(req.files.logo[0].path)
      : null;

    const businessProfile = req.files?.businessProfile
      ? await cloudinary.uploader.upload(req.files.businessProfile[0].path)
      : null;

    const toUpdateInputs = {
      businessName,
      position,
      businessTel,
      businessEmail,
      website,
      logo: logo?.secure_url || nameCardData.logo,
      businessProfile:
        businessProfile?.secure_url || nameCardData.businessProfile,
      themeId: themeId ? Number(themeId) : nameCardData.themeId,
    };

    for (let key in toUpdateInputs) {
      if (!toUpdateInputs[key]) {
        delete toUpdateInputs[key];
      }
    }

    let socialLinksArray = [];
    if (socialLinks) {
      socialLinksArray = JSON.parse(socialLinks);
    }

    const updatedCard = await prisma.nameCard.update({
      where: { id: Number(id) },
      data: {
        ...toUpdateInputs,
        socialLinked: {
          deleteMany: {},
          create: socialLinksArray.map((link) => ({
            socialName: link.name,
            url: link.url,
          })),
        },
      },
      include: { socialLinked: true },
    });

    res.json({
      message: "Edit Namecard Successful!!",
      nameCard: updatedCard,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteCard = async (req, res, next) => {
  try {
    const { id } = req.params;

    const nameCardData = await prisma.nameCard.findUnique({
      where: { id: Number(id) },
    });

    if (!nameCardData || req.user.id !== nameCardData.userId) {
      return createError(400, "Cannot Delete this NameCard");
    }

    await prisma.nameCard.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Delete Namecard Success" });
  } catch (err) {
    next(err);
  }
};
