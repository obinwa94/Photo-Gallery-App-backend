const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
require("dotenv").config()

const createJwtToken = (user) => {
    return jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );
};

module.exports = createJwtToken;
