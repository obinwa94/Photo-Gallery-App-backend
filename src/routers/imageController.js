const Image = require("../models/imageModel")
const sharp = require("sharp")
const path = require("path")
const fs = require("fs").promises

// ensure directory exists, if not create it
const ensureDirectories = async () => {
    const dir = ["src/uploads/temp", "src/uploads/resize"]
    for (const d of dir) {
        try {
            await fs.access(d)
        } catch (error) {
            await fs.mkdir(d, { recursive: true })
        }
    }
}

// Upload a single image, resize it, and save details to MongoDB
async function uploadSingleImage(req, res) {
    try {
        await ensureDirectories()
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" })
        }
        const tempPath = req.file.path
        const resizedFilename = `resized-${req.file.filename}`;
        const resizedPath = path.join("src/uploads/resize", resizedFilename)

        // Resize the image using sharp
        const resizedImage = await sharp(tempPath)
            .resize(800, 600, {
                fit: "inside",
                withoutEnlargement: true
            })
            .jpeg({ quality: 80 }) // Adjust dimensions as needed
            .toFile(resizedPath)

        // get image metadata
        const metadata = await sharp(resizedPath).metadata()

        // Save image details to MongoDB
        const newImage = new Image({
            originalName: req.file.originalname,
            fileName: resizedFilename,
            filePath: resizedPath,
            mimeType: req.file.mimetype,
            size: req.file.size,
            resizedSize: resizedImage.size,
            dimension: {
                width: metadata.width,
                height: metadata.height
            },
            url: `/uploads/resize/${resizedFilename}`

        })
        await newImage.save()

        // Delete the temporary file
        await fs.unlink(tempPath)

        res.status(201).json({
            status: "Success",
            message: "Image uploaded successfully",
            image: {
                id: newImage._id,
                originalName: newImage.originalName,
                filename: newImage.fileName,
                dimension: newImage.dimension,
                size: newImage.size,
                resizedSize: resizedImage.size,
                path: newImage.path,
                mimeType: newImage.mimeType,
                url: newImage.url
            }
        })


    } catch (error) {
        console.error("Error uploading image:", error)
        res.status(500).json({ message: "Error uploading image", error: error.message })
    }
}

//upload multiple images, resize them, and save details to MongoDB
async function uploadMultipleImages(req, res) {
    try {
        await ensureDirectories()
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" })
        }

        const uploadedImages = []

        for (const file of req.files) {
            const tempPath = file.path,
                resizedFilename = `resized- ${file.filename}`,
                resizedPath = path.join("src/uploads/resize", resizedFilename)

            // Resize the image using sharp
            const resizedImage = await sharp(tempPath)
                .resize(800, 600, {
                    fit: "inside",
                    withoutEnlargement: true
                })
                .jpeg({ quality: 80 }) // Adjust dimensions as needed
                .toFile(resizedPath)

            // get image metadata
            const metadata = await sharp(resizedPath).metadata()

            // save image details to MongoDB
            const newImage = new Image({
                originalName: file.originalname,
                fileName: resizedFilename,
                filePath: resizedPath,
                mimeType: file.mimetype,
                size: file.size,
                resizedSize: resizedImage.size,
                dimension: {
                    width: metadata.width,
                    height: metadata.height
                },
                url: `/uploads/resize/${resizedFilename}`

            })
            await newImage.save()




            // Delete the temporary file
            await fs.unlink(tempPath)

            uploadedImages.push({
                id: newImage._id,
                originalName: newImage.originalName,
                filename: newImage.fileName,
                filePath: newImage.filePath,
                mimeType: newImage.mimeType,
                size: newImage.size,
                resizedSize: newImage.resizedSize,
                dimensions: newImage.dimension,
                url: newImage.url,
            })


        }

        res.status(201).json({
            message: "Images uploaded successfully",
            images: uploadedImages
        })





    } catch (error) {
        console.error("Error uploading images:", error)
        res.status(500).json({ message: "Error uploading images", error: error.message })
    }
}

// Get single image by ID from MongoDB
async function getImageById(req, res) {
    try {
        // check if the provided ID is a valid MongoDB ObjectId
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid image ID" })
        }

        const image = await Image.findById(req.params.id);
        res.status(200).json({ image })


    } catch (error) {
        return res.status(500).json({ message: "Error fetching image", error: error.message })
    }
}


// Get all images from MongoDB
async function getAllImages(req, res) {
    try {
        const images = await Image.find().sort({ createdAt: -1 })
        res.status(200).json({ images })
    } catch (error) {
        return res.status(500).json({ message: "Error fetching images", error: error.message })
    }

}

// Delete image by ID from MongoDB
async function deleteImageById(req, res) {
    try {
        const id = req.params.id

        //check if ID exists in the database
        const image = await Image.findById(id);

        if (!image) {
            return res.status(404).json({ message: "Image not found" })
        }

        // Delete the image file from the filesystem
        await fs.unlink(image.filePath)

        // Delete the image document from MongoDB
        await Image.findByIdAndDelete(id)

        res.status(200).json({
            message: "Image deleted successfully",
            image: {
                id: image._id,
                originalName: image.originalName,
                filename: image.fileName,
                dimensions: image.dimensions,
                size: image.resizedSize,
            }
        })

    } catch (error) {
        return res.status(500).json({ message: "Error deleting image", error: error.message })
    }
}



module.exports = {
    getAllImages, uploadSingleImage, uploadMultipleImages, getImageById, deleteImageById
}