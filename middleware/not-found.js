const notFoundHandler = (req, res, next) => {
    res.status(404).json({message: "Resource not found on this server"})
}

module.exports = notFoundHandler