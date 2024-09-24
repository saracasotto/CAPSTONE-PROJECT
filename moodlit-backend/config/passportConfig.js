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
  async function (accessToken, refreshToken, profile, passportNext) {
    try {
      const { given_name: name, family_name: surname, email, sub: googleId, picture: avatar } = profile._json;

      let user = await User.findOne({ googleId });  //check nel database
      if (!user) {  //se non c'è, creo
        const newUser = new User({ googleId, name, surname, email, avatar });
        user = await newUser.save(); //salvo nel database
      }

      const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      passportNext(null, { jwtToken });
    } catch (error) {
      passportNext(error);
    }
  }
);


export { googleStrategy };
