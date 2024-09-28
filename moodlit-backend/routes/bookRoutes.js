import express from 'express';
import { 
    addBook, 
    getBooks, 
    updateBook, 
    deleteBook, 
    updateProgress,
    getBookByIdWithoutAuth,
    addBookWithoutAuth, 
    getAllBooksWithoutAuth, 
    updateBookWithoutAuth, 
    deleteBookWithoutAuth  } from '../controllers/bookController.js';
import authentication from '../middleware/authentication.js';

import multer from 'multer';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });



router.post('/add', upload.single('cover'), authentication, addBook);
router.get('/', authentication, getBooks);
router.put('/:id', authentication, updateBook);
router.delete('/:id', authentication, deleteBook);
router.put('/:id/progress', authentication, updateProgress);


//NO AUTENTICAZIONE
router.get('/getWithoutAuth/:id', getBookByIdWithoutAuth);
router.post('/addWithoutAuth', addBookWithoutAuth);
router.get('/getWithoutAuth', getAllBooksWithoutAuth);
router.put('/updateWithoutAuth/:id', updateBookWithoutAuth);
router.delete('/deleteWithoutAuth/:id', deleteBookWithoutAuth);

export default router;
