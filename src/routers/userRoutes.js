const userRouter = require("express").Router()
const { createUserController } = require("./userController")
const authToken = require("../middleware/jwtAuth")

//signup router
userRouter.post("/signup", createUserController)

// sign in router
//update user router
//delete user router

module.exports = userRouter;