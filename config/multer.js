import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },

    filename(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
})
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype.startsWith("image/") ||
        file.mimetype.startsWith("video/") ||
        file.mimetype === "application/pdf"
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only image, video, and PDF files are allowed"), false);
    }
};
const upload = multer({
    storage, fileFilter, limits: {
        fileSize: 100 * 1024 * 1024 // 100MB
    }
});

export default upload;