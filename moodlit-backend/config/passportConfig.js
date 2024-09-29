import GoogleStrategy from 'passport-google-oauth20';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()


const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async function (accessToken, refreshToken, profile, passportNext) { //token google, token refresh, dati e callback
    try {
      const { given_name: name, family_name: surname, email, sub: googleId, picture: avatar } = profile._json;

      let user = await User.findOne({ googleId });  //check nel database
      if (!user) {  //se non c'è, creo
        const newUser = new User({ googleId, name, surname, email, avatar });
        user = await newUser.save(); //salvo nel database
      }
      
      //token contentente id, chiave, scadenza token
      const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      
      //passo null e utente autenticato come parametri se non c'è errore
      passportNext(null, { jwtToken });
    } catch (error) {
      passportNext(error);
    }
  }
);


export { googleStrategy };
