const multer = require("multer")
const path = require("path")


const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "src/uploads/temp") //this is a temporary storage location for the uploaded files. We will move them to the final destination after processing.
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname).toLowerCase())
    }
});

//file filter to only allow image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|bmp|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if(extname && mimeType){
        return cb(null, true)
    } else{
        cb(new Error("Only image files are allowed!"), false)
    }
}

// multer upload configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // limit file size to 10MB
    fileFilter: fileFilter
})

module.exports = upload;