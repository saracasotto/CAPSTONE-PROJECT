import Note from "../models/noteModel.js";
import Book from "../models/bookModel.js";

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
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.noteId,
      user: req.loggedUser._id,
    });
    if (!deletedNote) {
      return res
        .status(404)
        .json({ message: "Nota non trovata o non autorizzata" });
    }
    res.status(200).json({ message: "Nota eliminata con successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore nell'eliminazione della nota" });
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
