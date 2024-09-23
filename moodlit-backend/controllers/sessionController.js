import Session from '../models/Session.js';
import Book from '../models/Book.js';

export const addSession = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findOne({ _id: bookId, user: req.loggedUser._id });
    if (!book) {
      return res.status(404).json({ message: "Libro non trovatoo" });
    }

    const newSession = new Session({
      user: req.loggedUser._id,
      book: bookId,
      startTime: Date.now(),
    });

    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ message: "Errore" });
  }
};

export const getSessionsByUser = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.loggedUser._id }).populate('book').lean();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Errore" });
  }
};

export const getSessionsByBook = async (req, res) => {
  try {
    const sessions = await Session.find({ book: req.params.bookId, user: req.loggedUser._id }).lean();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Errore" });
  }
};

export const updateSession = async (req, res) => {
  try {
    const { endTime } = req.body;
    const updatedSession = await Session.findOneAndUpdate(
      { _id: req.params.sessionId, user: req.loggedUser._id }, 
      { endTime, status: 'completed' }, 
      { new: true }
    );
    if (!updatedSession) {
      return res.status(404).json({ message: "Sessione non trovata" });
    }
    res.status(200).json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: "Errore" });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const deletedSession = await Session.findOneAndDelete({ _id: req.params.sessionId, user: req.loggedUser._id });
    if (!deletedSession) {
      return res.status(404).json({ message: "Sessione non trovata " });
    }
    res.status(200).json({ message: "Sessione eliminata " });
  } catch (error) {
    res.status(500).json({ message: "Errore" });
  }
};
