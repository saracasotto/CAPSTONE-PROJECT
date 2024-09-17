import express from 'express';
import { addNote, getNotesByBook, updateNote, deleteNote } from '../controllers/noteController.js';
import authentication from '../middleware/authentication.js';

const router = express.Router();

router.post('/', authentication, addNote);
router.get('/book/:bookId', authentication, getNotesByBook);
router.put('/:noteId', authentication, updateNote);
router.delete('/:noteId', authentication, deleteNote);


export default router;
