import express from 'express';
import { 
    addCategory, 
    getCategories, 
    updateCategory, 
    deleteCategory,
    getCategoriesWithoutAuth,
    addCategoryWithoutAuth,
    updateCategoryWithoutAuth,
    deleteCategoryWithoutAuth,
    getBooksByCategory
} from '../controllers/categoryController.js';
import authentication from '../middleware/authentication.js';

const router = express.Router();


router.post('/', authentication, addCategory);
router.get('/', authentication, getCategories);
router.put('/:id', authentication, updateCategory);
router.delete('/:id', authentication, deleteCategory);
router.get('/:id/books', authentication, getBooksByCategory);


router.post('/addWithoutAuth', addCategoryWithoutAuth);
router.get('/getWithoutAuth', getCategoriesWithoutAuth);
router.put('/updateWithoutAuth/:id', updateCategoryWithoutAuth);
router.delete('/deleteWithoutAuth/:id', deleteCategoryWithoutAuth);

export default router;
