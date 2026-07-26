import express from 'express';
import { gallerySingleUpload, multerHandler } from '../middleware/galleryUpload.js';
import {
  uploadGalleryMedia,
  getGallery,
  getGalleryItem,
  deleteGallery,
} from '../controllers/gallery.controller.js';

const router = express.Router();

router.post('/gallery', multerHandler(gallerySingleUpload), uploadGalleryMedia);
router.get('/gallery', getGallery);
router.get('/gallery/:id', getGalleryItem);
router.delete('/gallery/:id', deleteGallery);

export default router;
