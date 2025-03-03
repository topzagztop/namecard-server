const prisma = require("../configs/prisma")
const createError = require("../utils/createError")

exports.addContact = async (req, res, next) => {
    try {
        const {namecardId } = req.body
        const userId = req.user.id

        const nameCardData = await prisma.nameCard.findUnique({
            where: {id: Number(namecardId)},
        })

        if(!nameCardData) {
            return createError(404, "NameCard not found")
        }

        const contact = await prisma.contact.upsert({
            where: {namecardId: Number(namecardId)},
            update: {},
            create: {namecardId: Number(namecardId)}
        })

        const newContactList = await prisma.contactList.create({
            data: {
                userId: userId,
                contactId: contact.id,
            }
        })

        res.json({
          message: "Add Contact Successful!",
          contact: newContactList,
        });

    } catch (err) {
        next(err)
    }
}

exports.getContact = async (req, res, next) => {
    try {
        const userId = req.user.id

        const contacts = await prisma.contactList.findMany({
            where: {userId: userId},
            include: {
                contacts: {
                    include: {
                        namecard: true
                    }
                }
            }
        })

        res.json({message: "Get Contacts Successful", contacts: contacts})
    } catch (err) {
        next(err)
    }
}

exports.deleteContact = async (req, res, next) => {
    try {
        const {id} = req.params

        const userId = req.user.id

        const contactData = await prisma.contactList.findFirst({
            where: {
                id: Number(id),
                userId: userId
            }
        })
        if (!contactData) {
            return res.status(404).json({ message: "Contact not found" });
        }

        await prisma.contactList.delete({
            where: { id: Number(id) },
        });

        res.json({message: "Delete Contact Successful"})
    } catch (err) {
        next(err)
    }
}