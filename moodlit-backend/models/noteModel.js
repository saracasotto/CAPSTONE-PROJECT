import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    content: { type: String, required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
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
