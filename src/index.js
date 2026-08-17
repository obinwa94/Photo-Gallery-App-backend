const express = require("express")
const cors = require("cors")
require("dotenv").config()
const mongoDBConnecion = require("./db")
const imageRoutes = require("./routers/imageRoutes")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 5001

//middlewares
app.use(cors())
app.use(express.json())

//serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api/images", imageRoutes)

// error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ 
        message: "Something went wrong",
        details: err.message
    })
})



mongoDBConnecion()
app.listen(PORT, () => {
    console.log("App is running")
})