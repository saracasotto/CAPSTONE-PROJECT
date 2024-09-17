import express from 'express';
import { getUser, updateUser, deleteUser } from '../controllers/userController.js';
import authentication from '../middleware/authentication.js'; 

const router = express.Router();

router.get('/profile', authentication, getUser);
router.put('/profile', authentication, updateUser);
router.delete('/profile', authentication, deleteUser);

export default router;
