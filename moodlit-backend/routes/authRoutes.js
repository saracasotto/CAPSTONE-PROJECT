import express from 'express';
import { register, login } from '../controllers/authController.js';
import passport from 'passport';
import '../config/passportConfig.js'

const router = express.Router();

router.post('/register', register);
router.post('/login', login);


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  const { jwtToken } = req.user;
  res.redirect(`/dashboard?token=${jwtToken}`);
});


export default router; 
