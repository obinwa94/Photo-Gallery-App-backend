const mongoose = require("mongoose")
require("dotenv").config()

function mongoDBConnecion() {
    mongoose.connect(process.env.DB_URL, {
        dbName: "Gallery"
    })
        try {
        console.log("MongoDb connected")

    } catch (error) {
        console.log("MongoDb not connected")
    }
}

module.exports = mongoDBConnecion;