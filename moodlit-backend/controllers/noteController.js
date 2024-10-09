import Note from "../models/noteModel.js";
import Book from "../models/bookModel.js";
import User from "../models/userModel.js";

export const addNote = async (req, res) => {
  try {
    const { title, content, chapter } = req.body;
    const { bookId } = req.params;
    const book = await Book.findOne({ _id: bookId, user: req.loggedUser._id });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const newNote = new Note({
      title,
      content,
      chapter,
      book: bookId,
      user: req.loggedUser._id,
    });
    await newNote.save();

    const user = await User.findById(req.loggedUser._id);
    user.notes.push(newNote._id);
    await user.save();

    book.notes.push(newNote._id);
    await book.save();

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Error adding new note" });
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
    res.status(500).json({ message: "Error fetching notes" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { title, content, chapter } = req.body;
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.noteId, user: req.loggedUser._id },
      { title, content, chapter }, 
      { new: true }
    );
    if (!updatedNote) {
      return res
        .status(404)
        .json({ message: "Note not found" });
    }
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: "Error updating note" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await Note.deleteOne({ _id: note._id });
    await User.findByIdAndUpdate(req.loggedUser._id, {
      $pull: { notes: req.params.noteId }, 
    });
    await Book.findByIdAndUpdate(note.book, {
      $pull: { notes: req.params.noteId }, 
    });

    res.json({ message: "Note successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error " + error.message });
  }
};

export const getAllNotesByUser = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.loggedUser._id }).populate(
      "book",
      "title"
    ); 
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes" });
  }
};
