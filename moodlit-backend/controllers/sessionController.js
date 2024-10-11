import Session from '../models/sessionModel.js';
import Book from '../models/bookModel.js';


export const addSession = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findOne({ _id: bookId, user: req.loggedUser._id });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const newSession = new Session({
      user: req.loggedUser._id,
      book: bookId,
      startTime: Date.now(),
    });

    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ message: "Errore creating session" });
  }
};

export const getSessionsByUser = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.loggedUser._id }).populate('book').lean();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Error fetchung sessions" });
  }
};

export const getSessionsByBook = async (req, res) => {
  try {
    const sessions = await Session.find({ book: req.params.bookId, user: req.loggedUser._id }).lean();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Errore fetching sessions" });
  }
};

export const updateSession = async (req, res) => {
  try {
    const { endTime, pagesRead } = req.body;
    const session = await Session.findOne({ _id: req.params.sessionId, user: req.loggedUser._id });
    
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    
    session.endTime = endTime;
    session.pagesRead = pagesRead;
    session.duration = (new Date(endTime) - new Date(session.startTime)) / 1000; 
    session.status = 'completed';

    await session.save();

    // Aggiorna il libro associato
    const book = await Book.findById(session.book);
    if (book) {
      book.progress += pagesRead;
      // Non modifichiamo book.totalPages qui
      await book.save();
    }

    res.status(200).json({ session, book });
  } catch (error) {
    res.status(500).json({ message: "Error updating session", error: error.message });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const deletedSession = await Session.findOneAndDelete({ _id: req.params.sessionId, user: req.loggedUser._id });
    if (!deletedSession) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.status(200).json({ message: "Session deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting session" });
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
      timeRead: Math.round(session.duration / 60) 
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
    res.status(500).json({ message: "Error getting stats" });
  }
};


export const resetReadingStats = async (req, res) => {
  try {
    // Delete all completed sessions for the user
    await Session.deleteMany({ user: req.loggedUser._id, status: 'completed' });

    // Reset progress for all books of the user
    await Book.updateMany(
      { user: req.loggedUser._id },
      { $set: { progress: 0, status: 'to_read' } }
    );

    res.status(200).json({ message: "All reading stats have been reset successfully" });
  } catch (error) {
    console.error('Error resetting stats:', error);
    res.status(500).json({ message: "Error resetting stats", error: error.message });
  }
};