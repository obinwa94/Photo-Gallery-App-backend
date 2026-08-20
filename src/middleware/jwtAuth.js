const jwt = require("jsonwebtoken")

function authToken (req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: "Please login again. Your session has expired or the token is invalid."
            })
        }
        req.user = user;
    })
 
    next()
}

module.exports = authToken