import express from 'express';
import { addQuote, getQuotesByBook, updateQuote, deleteQuote } from '../controllers/quoteController.js';
import authentication from '../middleware/authentication.js';

const router = express.Router();


router.post('/', authentication, addQuote);
router.get('/book/:bookId', authentication, getQuotesByBook);
router.put('/:quoteId', authentication, updateQuote);
router.delete('/:quoteId', authentication, deleteQuote);

export default router;
