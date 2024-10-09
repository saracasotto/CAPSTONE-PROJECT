import User from '../models/userModel.js'
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import passport from 'passport';


//register new user
export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if user exists
    const existingUser = await User.findOne({ email });
   
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" }); 
    }

    // create new user
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ email, password: hashedPassword });


    await newUser.save();
    const token = generateToken(newUser);

    
    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};

// user login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user);
    res.status(200).json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// google login
export const googleLogin = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

//google OAuth callback
export const googleCallback = (req, res) => {
  if (!req.user || !req.user.jwtToken) {
    return res.status(400).json({ message: "Authentication with Google failed" });
  }
  setTimeout(() => {
    res.redirect(`${process.env.FRONTEND_URL}/?token=${req.user.jwtToken}`);
  }, 1000);
};

