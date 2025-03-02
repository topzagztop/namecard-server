const prisma = require("../configs/prisma")

exports.getTheme = async (req, res, next) => {
    try {
        const themes = await prisma.theme.findMany()
        
        res.json({message: "Get Theme All", theme: themes})
    } catch (err) {
        next(err)
    }
}