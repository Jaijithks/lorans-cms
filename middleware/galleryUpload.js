import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';

const TEMP_UPLOAD_DIR = path.join(os.tmpdir(), 'cms-uploads');

try {
  fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
} catch (e) {
  console.error('Error creating temp upload dir:', e);
}

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
    const safeName = (file.originalname || 'upload').replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${timestamp}-${safeName}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    const error = new Error(`Unsupported media type: ${file.mimetype}`);
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

export const gallerySingleUpload = upload.any();

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

