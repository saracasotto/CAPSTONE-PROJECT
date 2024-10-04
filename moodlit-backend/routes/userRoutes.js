import express from 'express';
import { getUser, updateUser, deleteUser, getAllUsers, updateUserById, deleteUserById, uploadUserAvatar } from '../controllers/userController.js';
import authentication from '../middleware/authentication.js'; 
import { upload } from '../config/cloudinaryConfig.js';

const router = express.Router();

router.get('/profile', authentication, getUser);
router.put('/profile', authentication, updateUser);
router.delete('/profile', authentication, deleteUser);
router.post('/uploadAvatar', upload.single('avatar'), uploadUserAvatar)


// Rotte senza autenticazione
router.get('/', getAllUsers);
router.put('/:id', updateUserById); 
router.delete('/:id', deleteUserById); 


export default router;
