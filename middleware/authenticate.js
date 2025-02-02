const authenticate = (req, res, next) => {
    req.user = { id: 1 };
    console.log(req.user);
    
    next()
}

module.exports = authenticate