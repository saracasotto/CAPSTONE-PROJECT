import User from '../models/userModel.js'
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import passport from 'passport';


export const register = async (req, res) => {
  //prendo dati necessari dalla richiesta http
  const { email, password } = req.body;

  try {
    //cerco se esiste
    const existingUser = await User.findOne({ email });
    //se esiste, do errore
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });  //togliere
    }

    //inizializzo variabili password e utente
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ email, password: hashedPassword });

    //salvo utente nel database e lo passo come parametro alla funzione
    await newUser.save();
    const token = generateToken(newUser);

    //rispondo con stato di creazione e includo token
    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    //confronto email
    if (!user) {
      return res.status(400).json({ error: error.message }); 
    }

    //confronto password
    const isPasswordValid = bcrypt.compare(password, user.password);  //check password esistente
    if (!isPasswordValid) {
      return res.status(400).json({ error: error.message }); 
    }

    //genero token
    const token = generateToken(user);
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};


export const googleLogin = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

export const googleCallback = (req, res) => {
  if (!req.user || !req.user.jwtToken) {
    console.log("Errore: token not found.");
    return res.status(400).json({ message: "Authentication with Google failed" });
  }
  console.log("Token JWT reveived:", req.user.jwtToken);
  setTimeout(() => {
    res.redirect(`${process.env.FRONTEND_URL}/?token=${req.user.jwtToken}`);
  }, 1000);
};

