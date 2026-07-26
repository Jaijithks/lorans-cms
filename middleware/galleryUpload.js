import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMP_UPLOAD_DIR = path.resolve(__dirname, '../uploads/tmp');

const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
  'video/x-msvideo',
  'video/mkv',
  'video/3gpp',
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${timestamp}-${safeName}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    const error = new Error('Unsupported media type');
    error.status = 415;
    return cb(error, false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter,
});

export const gallerySingleUpload = upload.single('file');
export const multerHandler = (uploadFn) => (req, res, next) => {
  uploadFn(req, res, (err) => {
    if (err) {
      console.error('========== MULTER ERROR ==========');
      console.error(err);
      if (err.code === 'LIMIT_FILE_SIZE') err.status = 413;
      if (!err.status) err.status = 400;

      return res.status(err.status).json({
        success: false,
        message: err.message || 'File upload failed',
        error: err.name || 'MulterError',
      });
    }
    next();
  });
};

export const cleanTemporaryFile = async (filePath) => {
  if (!filePath) return;
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    // ignore cleanup failures
  }
};
