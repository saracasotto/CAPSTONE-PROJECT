import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: async (req, file) => {
      let folderName = '';
  
      if (req.body.type === 'book') {
        folderName = 'books';
      } else if (req.body.type === 'user') {
        folderName = 'users';
      } else {
        folderName = 'misc'; 
      }
  
      return {
        folder: folderName, 
        allowed_formats: ['jpg', 'png', 'jpeg'], 
        public_id: `${Date.now()}-${file.originalname.split('.')[0]}` // Nome file univoco
      };
    }
  });
  

const upload = multer({ storage });


export default upload;