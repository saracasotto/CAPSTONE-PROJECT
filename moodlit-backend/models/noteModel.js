import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Titolo della nota
  content: { type: String, required: true }, // Contenuto della nota
  chapter: { type: String }, // Capitolo della nota
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }, // Riferimento al libro
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Riferimento all'utente
  createdAt: { type: Date, default: Date.now }, // Data di creazione
  updatedAt: { type: Date, default: Date.now }  // Data di aggiornamento
});


// Middleware pre('save') viene eseguito prima di ogni operazione di salvataggio (save)
// Questo middleware aggiorna il campo 'updatedAt' con la data e l'ora corrente ogni volta 
// che una nota viene creata o aggiornata. In questo modo, il campo 'updatedAt' riflette 
// sempre l'ultima modifica apportata alla nota.

noteSchema.pre('save', function (next) {
    this.updatedAt = Date.now(); // Aggiorna 'updatedAt' alla data corrente
    next(); // Passa al prossimo middleware o alla funzione di salvataggio
  });


const Note = mongoose.model('Note', noteSchema, 'notes');

export default Note
