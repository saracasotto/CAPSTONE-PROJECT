import express from 'express';
import { 
  addSession, 
  getSessionsByUser, 
  getSessionsByBook, 
  updateSession, 
  deleteSession,
  getReadingStats, 
  resetReadingStats
} from '../controllers/sessionController.js';
import authentication from '../middleware/authentication.js'; 

const router = express.Router();

router.post('/', authentication, addSession);
router.get('/', authentication, getSessionsByUser);
router.get('/book/:bookId', authentication, getSessionsByBook);
router.put('/:sessionId', authentication, updateSession);
router.delete('/:sessionId', authentication, deleteSession);

// Nuova rotta per le statistiche di lettura
router.get('/stats', authentication, getReadingStats);
router.post('/reset', authentication, resetReadingStats);


export default router;