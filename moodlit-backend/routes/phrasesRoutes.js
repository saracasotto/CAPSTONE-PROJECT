import express from 'express';
import { getRandomPhrase, addPhrase } from '../controllers/phrasesController.js';
import authentication from '../middleware/authentication.js';

const router = express.Router();

router.get('/', authentication, getRandomPhrase);

router.post('/', addPhrase);

export default router;
