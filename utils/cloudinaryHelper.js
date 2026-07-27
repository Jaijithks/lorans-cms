import cloudinary from '../config/cloudinaryConfig.js';

const generateImageThumbnailUrl = (publicId) => {
  return cloudinary.url(publicId, {
    resource_type: 'image',
    format: 'webp',
    transformation: [
      { width: 800, height: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
    ],
  });
};

const generateVideoThumbnailUrl = (publicId) => {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    format: 'jpg',
    transformation: [
      { width: 640, height: 360, crop: 'fill', quality: 'auto', fetch_format: 'auto' },
    ],
  });
};

export const uploadCloudinaryAsset = async (localPath, mediaType, folder) => {
  const uploadOptions = {
    resource_type: mediaType,
    folder,
  };

  if (mediaType === 'video') {
    uploadOptions.eager = [
      {
        width: 640,
        height: 360,
        crop: 'fill',
        format: 'jpg',
      },
    ];
  }

  return cloudinary.uploader.upload(localPath, uploadOptions);
};

export const deleteCloudinaryAsset = async (publicId, mediaType) => {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: mediaType,
    invalidate: true,
  });
};

export const buildThumbnailUrl = (publicId, mediaType) => {
  if (mediaType === 'video') {
    return generateVideoThumbnailUrl(publicId);
  }

  return generateImageThumbnailUrl(publicId);
};
