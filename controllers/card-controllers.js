const prisma = require("../configs/prisma");
const { nanoid } = require("nanoid");
const QRCode = require('qrcode');
const cloudinary = require("../configs/cloudinary")

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


    const userId = req.user.id

    const slug = nanoid(10)

    const qrData = `${process.env.BASE_URL}/namecard/${slug}`
    const qrCodeBuffer = await QRCode.toBuffer(qrData)

    const qrCodeUpload = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
            folder: "qrcode", resource_type : "image"
        },
        (error, result) => {
            if(error) reject(error)
            else resolve(result)
        }
    ).end(qrCodeBuffer)
    })

    const result = JSON.parse(socialLinks)

    // validation

    const newCard = await prisma.nameCard.create({
        data: {
            businessName,
            position,
            businessTel,
            businessEmail,
            logo : logo?.secure_url,
            businessProfile : businessProfile?.secure_url,
            website,
            slug,
            qrcode: qrCodeUpload.secure_url,
            user: {
                connect: {
                    id: userId
                }
            },
            theme: {
                connect: {
                    id: Number(themeId)
                }
            },
            socialLinked: {
                create: result?.map(link => ({
                    socialName: link.name,
                    url: link.url
                })) || []
            }
        },
        include: {
            socialLinked : true
        }
    })



    res.json({ 
        message: "Register Namecard Successful",
        namecard: newCard
     });
  } catch (err) {
    next(err);
  }
};
