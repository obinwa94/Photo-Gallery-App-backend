
const { StatusCodes } = require("http-status-codes")
const { matchedData } = require("express-validator")
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const createJwtToken = require("./createToken")


async function handlePostLogin(req, res) {
    // const validatedData = matchedData(req)
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Invalid email"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Invalid password"
            })
        }

        const token = createJwtToken(user);
        
        res.status(StatusCodes.OK).json({
            message: "Login successful",
            accessToken: token,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        })
    } catch (error) {
        // errorLogger("Error occurred while logging in", req, error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred while logging in",
            error: error.message
        })
    }
}

module.exports = {
    handlePostLogin
}



