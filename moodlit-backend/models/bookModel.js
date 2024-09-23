import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  cover: { type: String }, // URL immagine copertina via Cloudinary
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // Collegato alle categorie
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  progress: { type: Number, default: 0 }, // Percentuale di lettura o pagine lette
  barcode: { type: String }, // Codice a barre per aggiungere tramite scanner
  publisher: { type: String }, // Editore (recuperato automaticamente tramite barcode)
  description: { type: String }, // Descrizione del libro (recuperata automaticamente o inserita manualmente)
  notes: { type: mongoose.Schema.Types.ObjectId, ref: "Note" }, // Note personali
  quotes: { type: mongoose.Schema.Types.ObjectId, ref: "Quote" }, // Citazioni salvate
  status: { 
    type: String, 
    enum: ['to_read', 'reading', 'completed'], 
    default: 'to_read' 
  }, // Stato del libro
  sessions: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Session' 
  }],
}, { timestamps: true }); // Per tenere traccia di creazione e aggiornamento

const Book = mongoose.model('Book', bookSchema, 'books');

export default Book;
