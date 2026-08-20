const router = require("express").Router()
const { getAllImages, uploadSingleImage, uploadMultipleImages, getImageById, deleteImageById } = require("./imageController")
const upload = require("../middleware/upload")
const tokenAuth = require("../Auth/tokenAuth")

router.use(tokenAuth)

// upload single image
router.post("/upload/single", upload.single("image"), uploadSingleImage)

// upload multiple images
router.post("/upload/multiple", upload.array("images", 10), uploadMultipleImages)

// get single image by ID
router.get("/:id", getImageById)

// get all images
router.get("/", getAllImages)

// delete image by ID
router.delete("/delete/:id", deleteImageById)


module.exports = router