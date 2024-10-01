import express from 'express';
import { register, login } from '../controllers/authController.js';
import passport from 'passport';
import '../config/passportConfig.js'

const router = express.Router();

router.post('/register', register);
router.post('/login', login);


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }), 
  (req, res) => {
    // Genera un token JWT
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email }, // payload
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );

    res.redirect(`/mood-selection?token=${token}`);
  }
);


export default router; 
