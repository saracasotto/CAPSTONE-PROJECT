import express from 'express';
import { register, login, googleLogin, googleCallback } from '../controllers/authController.js';
import passport from 'passport';
import '../config/passportConfig.js'

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/login-google', googleLogin);
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);



export default router; 
