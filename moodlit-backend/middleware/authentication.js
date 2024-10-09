import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET;

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Malformed Token' });
  }

  const token = parts[1];

  try {

    const payload = jwt.verify(token, JWT_SECRET);
    /*console.log('Token payload: ', payload); per debug */


    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.loggedUser = user;

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
