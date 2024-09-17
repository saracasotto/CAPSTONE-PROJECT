import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({
  content: { type: String, required: true },  // Il contenuto della quote
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },  // Collegamento al libro a cui la quote appartiene
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Collegamento all'utente che ha aggiunto la quote
  createdAt: { type: Date, default: Date.now },  // Data di creazione
  updatedAt: { type: Date, default: Date.now },  // Data di ultima modifica
  shared: { type: Boolean, default: false },  // Indica se la quote è stata condivisa online
  sharePlatform: { type: String, enum: ['facebook', 'twitter', 'instagram', 'other'], default: 'other' },  // Piattaforma di condivisione
  sharedAt: { type: Date }  // Data di condivisione (se applicabile)
});

// Middleware pre('save') per aggiornare 'updatedAt' e 'sharedAt'
quoteSchema.pre('save', function (next) {
  this.updatedAt = Date.now(); // Aggiorna 'updatedAt' alla data corrente
  if (this.shared && !this.sharedAt) {
    this.sharedAt = Date.now();  // Se è stata condivisa, aggiorna 'sharedAt'
  }
  next();  // Passa al prossimo middleware o alla funzione di salvataggio
});

const Quote = mongoose.model('Quote', quoteSchema, 'quotes');

export default Quote;
