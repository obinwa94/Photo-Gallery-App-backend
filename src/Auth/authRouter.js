const authRouter = require("express").Router()
const { validationResult } = require("express-validator")
const authController = require("./userAuthentication")
const { StatusCodes } = require("http-status-codes")
// const loginUserValidation = require("../validation/loginUserValidation")


authRouter.post('/login',  (req, res) => {
    result = validationResult(req)
    if (result.isEmpty()) {
        return authController.handlePostLogin(req, res)
    }
    res.status(StatusCodes.BAD_REQUEST).json(result.array())
})

module.exports = authRouter;