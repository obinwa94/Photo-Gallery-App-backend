const mongoose = require("mongoose")

const imageModel = new mongoose.Schema({
    originalName: {
        type: String,
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    mimeType: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    resizedSize: {
        type: Number,
        required: true,
    },
    dimension: {
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        }
    },

    url: {
        type: String,
        required: true
    }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model("Images", imageModel)