import express from 'express';
import { addNote, getNotesByBook, updateNote, deleteNote, getAllNotesByUser } from '../controllers/noteController.js';
import authentication from '../middleware/authentication.js';

const router = express.Router();

router.post('/:bookId/addnote', authentication, addNote);
router.get('/:bookId', authentication, getNotesByBook);
router.put('/:noteId', authentication, updateNote);
router.delete('/:noteId', authentication, deleteNote);
router.get('/user/allnotes', authentication, getAllNotesByUser);


export default router;
