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
    deleteBookWithoutAuth,  
    uploadBookCover} from '../controllers/bookController.js';
    
import authentication from '../middleware/authentication.js';

import  { upload } from  '../config/cloudinaryConfig.js'

const router = express.Router();



router.post('/add', authentication, addBook);
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
router.post('/upload-cover', upload.single('cover'), uploadBookCover)

export default router;
