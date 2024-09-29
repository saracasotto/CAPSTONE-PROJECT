import express from 'express';
import { getUser, updateUser, deleteUser, getAllUsers, updateUserById, deleteUserById, uploadUserProfilePicture } from '../controllers/userController.js';
import authentication from '../middleware/authentication.js'; 

const router = express.Router();

router.get('/profile', authentication, getUser);
router.put('/profile', authentication, updateUser);
router.delete('/profile', authentication, deleteUser);


// Rotte senza autenticazione
router.get('/', getAllUsers);
router.put('/:id', updateUserById); 
router.delete('/:id', deleteUserById); 
router.post('/uploadAvatar', uploadUserProfilePicture)

export default router;
