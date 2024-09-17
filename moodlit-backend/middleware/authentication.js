import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET;

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Controllo che l'header di autorizzazione esista
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing token' });
  }

  // Verifica che l'header contenga "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Malformed Token' });
  }

  const token = parts[1];

  try {
    // Decodifica e verifica il token JWT
    const payload = jwt.verify(token, JWT_SECRET);
    console.log('Token payload: ', payload); //Controllo payload

    //Check esistenza utente
    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Aggiungi l'utente verificato alla richiesta per l'uso nelle rotte successive
    req.loggedUser = user;

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
