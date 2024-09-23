import express from 'express';
import { addSession, getSessionsByUser, getSessionsByBook, updateSession, deleteSession } from '../controllers/sessionController.js';
import { authentication } from '../middleware/authentication.js'; 

const router = express.Router();

router.post('/', authentication, addSession);

// QUESTA MI SERVE PER ANALITICS
router.get('/', authentication, getSessionsByUser);

router.get('/book/:bookId', authentication, getSessionsByBook);
router.put('/:sessionId', authentication, updateSession);
router.delete('/:sessionId', authentication, deleteSession);

export default router;
