import express from 'express';
import { 
    addBook, 
    getBooks, 
    updateBook, 
    deleteBook, 
    updateProgress,
    addBookWithoutAuth, 
    getAllBooksWithoutAuth, 
    updateBookWithoutAuth, 
    deleteBookWithoutAuth  } from '../controllers/bookController.js';
import authentication from '../middleware/authentication.js';

const router = express.Router();


router.post('/add', authentication, addBook);
router.get('/', authentication, getBooks);
router.put('/:id', authentication, updateBook);
router.delete('/:id', authentication, deleteBook);
router.put('/:id/progress', authentication, updateProgress);


//NO AUTENTICAZIONE
router.post('/addWithoutAuth', addBookWithoutAuth);
router.get('/getWithoutAuth', getAllBooksWithoutAuth);
router.put('/updateWithoutAuth/:id', updateBookWithoutAuth);
router.delete('/deleteWithoutAuth/:id', deleteBookWithoutAuth);

export default router;
