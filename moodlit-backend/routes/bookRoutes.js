import express from 'express';
import { addBook, getBooks, updateBook, deleteBook, updateProgress } from '../controllers/bookController.js';
import authentication from '../middleware/authentication.js';

const router = express.Router();


router.post('/add', authentication, addBook);
router.get('/', authentication, getBooks);
router.put('/:id', authentication, updateBook);
router.delete('/:id', authentication, deleteBook);
router.put('/:id/progress', authentication, updateProgress);

export default router;
