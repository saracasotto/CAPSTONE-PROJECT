// controllers/uploadController.js
import cloudinary from '../config/cloudinaryConfig.js';

export const uploadCoverImage = async (req, res) => {
  try {
    // Controlla se è presente un file immagine da caricare su Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream({ folder: 'books' }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      stream.end(req.file.buffer);  // Carica il buffer del file immagine su Cloudinary
    });

    // Restituisce l'URL dell'immagine caricata
    res.status(201).json({ imageUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il caricamento dell\'immagine', error: error.message });
  }
};

