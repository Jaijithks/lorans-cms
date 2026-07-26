import Gallery from '../models/gallery.model.js';
import { cleanTemporaryFile } from '../middleware/galleryUpload.js';
import {
  uploadCloudinaryAsset,
  deleteCloudinaryAsset,
  buildThumbnailUrl,
} from '../utils/cloudinaryHelper.js';
import { sanitizeText, parseNumber } from '../utils/galleryValidation.js';

const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

const VIDEO_MIME_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
  'video/x-msvideo',
  'video/mkv',
  'video/3gpp',
]);

const getMediaTypeFromMime = (mimetype) => {
  if (IMAGE_MIME_TYPES.has(mimetype)) return 'image';
  if (VIDEO_MIME_TYPES.has(mimetype)) return 'video';
  return null;
};

const getCloudFolder = (mediaType) => (mediaType === 'video' ? 'gallery/videos' : 'gallery/images');

const validateUploadFields = ({ title, file }) => {
  const errors = [];

  if (!title || !title.trim()) {
    errors.push('Title is required');
  }

  if (!file) {
    errors.push('File is required');
  }

  return errors;
};

const validateFileSize = (file, mediaType) => {
  if (!file) return;
  const size = file.size;

  if (mediaType === 'image' && size > 10 * 1024 * 1024) {
    const error = new Error('Image file too large (max 10MB)');
    error.status = 413;
    throw error;
  }

  if (mediaType === 'video' && size > 100 * 1024 * 1024) {
    const error = new Error('Video file too large (max 100MB)');
    error.status = 413;
    throw error;
  }
};

const buildGalleryPayload = ({
  title,
  description,
  alt_text,
  media_type,
  media_url,
  secure_url,
  thumbnail_url,
  public_id,
}) => ({
  title: sanitizeText(title),
  description: sanitizeText(description),
  alt_text: sanitizeText(alt_text),
  media_type,
  media_url,
  secure_url,
  thumbnail_url,
  public_id,
});

const buildSortOption = (sort) => {
  switch (sort) {
    case 'latest':
      return { createdAt: -1 };
    case 'oldest':
      return { createdAt: 1 };
    default:
      return { createdAt: -1 };
  }
};

export const uploadGalleryMedia = async (req, res, next) => {
  const file = req.file;
  const { title, description, alt_text } = req.body;

  try {
    const validationErrors = validateUploadFields({ title, file });
    if (validationErrors.length) {
      const error = new Error(validationErrors.join(', '));
      error.status = 400;
      throw error;
    }

    const media_type = getMediaTypeFromMime(file.mimetype);
    if (!media_type) {
      const error = new Error(`Unsupported media type: ${file.mimetype}`);
      error.status = 415;
      throw error;
    }

    validateFileSize(file, media_type);

    const uploadResult = await uploadCloudinaryAsset(file.path, media_type, getCloudFolder(media_type));

    const payload = buildGalleryPayload({
      title,
      description,
      alt_text,
      media_type,
      media_url: uploadResult.url || uploadResult.secure_url,
      secure_url: uploadResult.secure_url || uploadResult.url,
      thumbnail_url: buildThumbnailUrl(uploadResult.public_id, media_type),
      public_id: uploadResult.public_id,
    });

    const galleryItem = await Gallery.create(payload);
    await cleanTemporaryFile(file.path);

    return res.status(201).json({
      success: true,
      message: 'Gallery item created successfully',
      data: galleryItem,
    });
  } catch (error) {
    await cleanTemporaryFile(file?.path);
    return next(error);
  }
};

export const getGallery = async (req, res, next) => {
  try {
    const page = Math.max(parseNumber(req.query.page, 1), 1);
    const limit = Math.max(parseNumber(req.query.limit, 20), 1);
    const sort = buildSortOption(req.query.sort);

    const total = await Gallery.countDocuments();
    const items = await Gallery.find()
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({
      success: true,
      message: 'Gallery fetched successfully',
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getGalleryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);
    if (!item) {
      const error = new Error('Gallery item not found');
      error.status = 404;
      throw error;
    }

    return res.json({
      success: true,
      message: 'Gallery item retrieved successfully',
      data: item,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteGallery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);
    if (!item) {
      const error = new Error('Gallery item not found');
      error.status = 404;
      throw error;
    }

    await deleteCloudinaryAsset(item.public_id, item.media_type);
    await item.deleteOne();

    return res.json({
      success: true,
      message: 'Gallery item deleted successfully',
      data: {},
    });
  } catch (error) {
    return next(error);
  }
};
