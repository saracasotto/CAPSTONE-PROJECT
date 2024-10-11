import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  cover: { 
    type: String,
    default: 'https://res.cloudinary.com/dg3ztnyg9/image/upload/v1728463747/Moodlit/wfniu4yhpzswmjt2mmmf.png' 
  }, 
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // Collegato alle categorie
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  totalPages: { type: Number, min: 0 },
  progress: { type: Number, min: 0, default: 0 },
  description: { type: String }, // Descrizione del libro (recuperata automaticamente o inserita manualmente)
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }], 
  quotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quote" }],
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

bookSchema.pre('save', function(next) {
  if (this.isModified('progress') || this.isModified('totalPages')) {
    if (this.progress === 0) {
      this.status = 'to_read';
    } else if (this.progress >= this.totalPages) {
      this.status = 'completed';
    } else {
      this.status = 'reading';
    }
  }
  next();
});

const Book = mongoose.model('Book', bookSchema, 'books');

export default Book;
