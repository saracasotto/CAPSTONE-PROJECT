import express from 'express';
import { getRandomPhrase, addPhrase } from '../controllers/phrasesController.js';

const router = express.Router();

router.get('/', getRandomPhrase);

router.post('/', addPhrase);

export default router;
