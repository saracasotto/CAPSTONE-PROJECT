import Session from '../models/sessionModel.js';
import Book from '../models/bookModel.js';


export const addSession = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findOne({ _id: bookId, user: req.loggedUser._id });
    if (!book) {
      return res.status(404).json({ message: "Libro non trovato" });
    }

    const newSession = new Session({
      user: req.loggedUser._id,
      book: bookId,
      startTime: Date.now(),
    });

    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ message: "Errore nel creare la sessione" });
  }
};

export const getSessionsByUser = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.loggedUser._id }).populate('book').lean();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recuperare le sessioni" });
  }
};

export const getSessionsByBook = async (req, res) => {
  try {
    const sessions = await Session.find({ book: req.params.bookId, user: req.loggedUser._id }).lean();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recuperare le sessioni del libro" });
  }
};

export const updateSession = async (req, res) => {
  try {
    const { endTime, pagesRead } = req.body;
    const session = await Session.findOne({ _id: req.params.sessionId, user: req.loggedUser._id });
    
    if (!session) {
      return res.status(404).json({ message: "Sessione non trovata" });
    }
    
    session.endTime = endTime;
    session.pagesRead = pagesRead;
    session.duration = (new Date(endTime) - new Date(session.startTime)) / 1000; // durata in secondi
    session.status = 'completed';

    await session.save();
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiornare la sessione" });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const deletedSession = await Session.findOneAndDelete({ _id: req.params.sessionId, user: req.loggedUser._id });
    if (!deletedSession) {
      return res.status(404).json({ message: "Sessione non trovata" });
    }
    res.status(200).json({ message: "Sessione eliminata con successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore nell'eliminare la sessione" });
  }
};

export const getReadingStats = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.loggedUser._id, status: 'completed' })
      .sort({ startTime: 1 })
      .lean();

    const stats = sessions.map(session => ({
      date: session.startTime.toISOString().split('T')[0],
      pagesRead: session.pagesRead,
      timeRead: Math.round(session.duration / 60) // convert seconds to minutes
    }));

    // Aggregate stats by date
    const aggregatedStats = stats.reduce((acc, curr) => {
      const existingDate = acc.find(item => item.date === curr.date);
      if (existingDate) {
        existingDate.pagesRead += curr.pagesRead;
        existingDate.timeRead += curr.timeRead;
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);

    res.status(200).json(aggregatedStats);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recuperare le statistiche di lettura" });
  }
};