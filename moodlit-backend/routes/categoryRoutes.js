import express from 'express';
import { addCategory, getCategories, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import authentication from '../middleware/authentication.js';

const router = express.Router();


router.post('/', authentication, addCategory);
router.get('/', authentication, getCategories);
router.put('/:id', authentication, updateCategory);
router.delete('/:id', authentication, deleteCategory);

export default router;
