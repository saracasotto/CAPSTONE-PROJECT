import { Router } from 'express';
import multer from 'multer';
import { uploadCoverImage } from '../controllers/uploadController.js'; 
const router = Router();
const upload = multer();  // Configura multer per gestire il file

router.post('/upload-cover', upload.single('cover'), uploadCoverImage);

export default router;