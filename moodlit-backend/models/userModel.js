import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    googleId: { type: String, index: true }, // Se l'utente ha usato Google
    name: { type: String}, // Solo il nome
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Se l'utente si registra via email/password
    avatar: {
      type: String,
      //default: LINK IMMAGINE DEFAULT
    }, // Campo opzionale per immagine profilo
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }], // Referenziando i libri
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }], // Referenziando le note
    quotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quote" }], // Referenziando le note
    sessions: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Session' 
    }],
    themePreference: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' }  // Aggiunta per la preferenza di tema

  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema, "users");

export default User;
