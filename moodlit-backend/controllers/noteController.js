import Note from "../models/noteModel.js";
import Book from "../models/bookModel.js";
import User from "../models/userModel.js";

export const addNote = async (req, res) => {
  try {
    const { title, content, chapter } = req.body;
    const { bookId } = req.params;

    // Verifica se il libro esiste e appartiene all'utente
    const book = await Book.findOne({ _id: bookId, user: req.loggedUser._id });
    if (!book) {
      return res
        .status(404)
        .json({ message: "Libro non trovato o non autorizzato" });
    }

    const newNote = new Note({
      title, // Aggiungi il titolo
      content,
      chapter, // Aggiungi il capitolo
      book: bookId,
      user: req.loggedUser._id,
    });
    await newNote.save();

    const user = await User.findById(req.loggedUser._id);
    user.notes.push(newNote._id);  // Aggiungi l'ID della nuova nota all'array notes
    await user.save();  // Salva l'utente aggiornato

     // Aggiorna il libro aggiungendo l'ID della nota all'array notes
     book.notes.push(newNote._id);  // Aggiungi l'ID della nuova nota all'array notes del libro
     await book.save();  // Salva il libro aggiornato


    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiunta della nota" });
  }
};

export const getNotesByBook = async (req, res) => {
  try {
    const notes = await Note.find({
      book: req.params.bookId,
      user: req.loggedUser._id,
    });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero delle note" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { title, content, chapter } = req.body;
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.noteId, user: req.loggedUser._id },
      { title, content, chapter }, // Aggiorna anche titolo e capitolo
      { new: true }
    );
    if (!updatedNote) {
      return res
        .status(404)
        .json({ message: "Nota non trovata o non autorizzata" });
    }
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiornamento della nota" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    // Trova la nota per ID
    const note = await Note.findById(req.params.noteId);
    
    // Verifica se la nota esiste
    if (!note) {
      return res.status(404).json({ message: 'Nota non trovata' });
    }

    // Verifica se l'autore della nota è lo stesso dell'utente autenticato
    if (note.user.toString() !== req.loggedUser._id.toString()) {
      return res.status(403).json({ message: 'Non hai il permesso di eliminare questa nota.' });
    }

    // Usa deleteOne per eliminare la nota
    await Note.deleteOne({ _id: note._id });

    // Rimuovi la nota dall'array delle note dell'utente
    await User.findByIdAndUpdate(req.loggedUser._id, {
      $pull: { notes: req.params.noteId }, // Rimuove la nota dall'array delle note dell'utente
    });

    // Rimuovi la nota dall'array delle note del libro
    await Book.findByIdAndUpdate(note.book, {
      $pull: { notes: req.params.noteId }, // Rimuove la nota dall'array delle note del libro
    });

    res.json({ message: 'Nota eliminata con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore del server: ' + error.message });
  }
};



export const getAllNotesByUser = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.loggedUser._id }).populate(
      "book",
      "title"
    ); // Popola il titolo del libro
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero delle note" });
  }
};
