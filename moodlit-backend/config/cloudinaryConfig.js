import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();  // Carica le variabili d'ambiente

// Configura Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configura Cloudinary Storage per Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    console.log('req.body.type:', req.body.type);  // Controlla se il type viene passato correttamente

    return {
      folder: "Moodlit",
      allowed_formats: ['jpg', 'png', 'jpeg'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});


const upload = multer({ storage });

export { upload, cloudinary };
