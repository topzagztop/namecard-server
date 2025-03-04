const prisma = require("../configs/prisma")
const createError = require("../utils/createError")

exports.addContact = async (req, res, next) => {
    try {
        const { namecardId } = req.body;
        const userId = req.user.id;

        const existingNameCard = await prisma.nameCard.findUnique({
            where: { id: namecardId }
        });

        if (!existingNameCard) {
            return createError(404, "NameCard not found");
        }

        let contact = await prisma.contact.findFirst({
            where: { namecardId }
        });

        if (!contact) {
            contact = await prisma.contact.create({
                data: {
                    namecardId
                }
            });
        }

        const existingContactList = await prisma.contactList.findFirst({
            where: {
                userId: userId,
                contactId: contact.id
            }
        });

        if (existingContactList) {
            return createError(400, "This NameCard is already added to your contacts.")
        }

        const newContactList = await prisma.contactList.create({
            data: {
                userId: userId,
                contactId: contact.id
            }
        });

        res.json({ message: "Contact added successfully!", contactList: newContactList });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.getContacts = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const contacts = await prisma.contactList.findMany({
            where: { userId: parseInt(userId) },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                    }
                },
                contacts: {
                    include: {
                        namecard: true
                    }
                }
            }
        });

        if (!contacts || contacts.length === 0) {
            return res.json({message: "No contacts found", contacts: []})
        }


        res.json({ message: "Get Contacts Successful", contacts });
    } catch (err) {
        console.error(err);
        next(err);
    }
};


exports.deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.contact.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: "Contact deleted successfully!" });
    } catch (err) {
        console.error(err);
        next(err);
    }
};