const userSchema = require("../models/userModel")
const bcrypt = require("bcrypt")
const handlePostLogin = require("../Auth/userAuthentication")
const createJwtToken = require("../Auth/createToken")



//create new user
const createUserController = async (req, res) => {
    const data = req.body
    try {
        //harsh password with bcrypt
        const hashedPassword = await bcrypt.hash(data.password, 10);

        //create new user instance
        const newUser = new userSchema({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword,
        })

        //save new user to database
        await newUser.save()
        
        const token = createJwtToken(newUser)


        return res.status(201).json({
            status: "Success",
            message: "User successfully created",
            data: {
                // id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                accessToken: token,
            },
        })
    } catch (error) {
        res.status(500).json({ message: "Failed to create new user", error: error.message })
    }
}



module.exports = { createUserController }