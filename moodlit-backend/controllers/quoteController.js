import Quote from "../models/quoteModel.js";
import Book from "../models/bookModel.js";


export const addQuote = async (req, res) => {
  try {
    const { content, bookId, shared, sharePlatform } = req.body;
    const book = await Book.findOne({ _id: bookId, user: req.loggedUser._id });
    if (!book) {
      return res.status(404).json({ message: "Libro non trovato o non autorizzato" });
    }

    const newQuote = new Quote({
      content,
      book: bookId,
      user: req.loggedUser._id,
      shared,
      sharePlatform,
    });

    await newQuote.save();
    res.status(201).json(newQuote);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiunta della citazione" });
  }
};

export const getQuotesByBook = async (req, res) => {
  try {
    const quotes = await Quote.find({ book: req.params.bookId, user: req.loggedUser._id });
    res.status(200).json(quotes);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero delle citazioni" });
  }
};

export const updateQuote = async (req, res) => {
  try {
    const { content, shared, sharePlatform } = req.body;
    const updatedQuote = await Quote.findOneAndUpdate(
      { _id: req.params.quoteId, user: req.loggedUser._id }, 
      { content, shared, sharePlatform },
      { new: true }
    );
    if (!updatedQuote) {
      return res.status(404).json({ message: "Citazione non trovata o non autorizzata" });
    }
    res.status(200).json(updatedQuote);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiornamento della citazione" });
  }
};

export const deleteQuote = async (req, res) => {
  try {
    const deletedQuote = await Quote.findOneAndDelete({ _id: req.params.quoteId, user: req.loggedUser._id });
    if (!deletedQuote) {
      return res.status(404).json({ message: "Citazione non trovata o non autorizzata" });
    }
    res.status(200).json({ message: "Citazione eliminata con successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore nell'eliminazione della citazione" });
  }
};
