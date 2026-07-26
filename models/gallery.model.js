import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    alt_text: {
      type: String,
      trim: true,
      default: '',
    },
    media_type: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    media_url: {
      type: String,
      required: true,
      trim: true,
    },
    secure_url: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail_url: {
      type: String,
      required: true,
      trim: true,
    },
    public_id: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Gallery', GallerySchema);
