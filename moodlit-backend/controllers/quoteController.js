import Quote from "../models/quoteModel.js";
import Book from "../models/bookModel.js";
import User from "../models/userModel.js";


export const addQuote = async (req, res) => {
  try {
    const { content } = req.body;
    const { bookId } = req.params;

    // Verifica se il libro esiste e appartiene all'utente
    const book = await Book.findOne({ _id: bookId, user: req.loggedUser._id });
    if (!book) {
      return res.status(404).json({ message: "Libro non trovato o non autorizzato" });
    }

    // Creazione della nuova citazione
    const newQuote = new Quote({
      content,
      book: bookId,
      user: req.loggedUser._id,
    });
    await newQuote.save();  // Salva la nuova citazione

    // Aggiorna l'utente aggiungendo l'ID della citazione all'array quotes
    const user = await User.findById(req.loggedUser._id);
    user.quotes.push(newQuote._id);  // Aggiungi l'ID della nuova citazione all'array quotes dell'utente
    await user.save();  // Salva l'utente aggiornato

    // Aggiorna il libro aggiungendo l'ID della citazione all'array quotes
    book.quotes.push(newQuote._id);  // Aggiungi l'ID della nuova citazione all'array quotes del libro
    await book.save();  // Salva il libro aggiornato

    res.status(201).json(newQuote);
  } catch (error) {
    console.error("Errore nell'aggiunta della citazione:", error);  // Aggiungi questo per vedere l'errore esatto
    res.status(500).json({ message: "Errore nell'aggiunta della citazione", error: error.message });
  }
};


export const getQuotesByBook = async (req, res) => {
  try {
    const quotes = await Quote.find({ book: req.params.bookId, user: req.loggedUser._id })
      .populate('book', 'title author'); // Popola il titolo e l'autore del libro
    res.status(200).json(quotes);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero delle citazioni" });
  }
};


export const updateQuote = async (req, res) => {
  try {
    const { content, shared, sharePlatform } = req.body;
    const updateData = { content, shared, sharePlatform };
    
    // Se la citazione è stata condivisa, aggiungi la data di condivisione
    if (shared) {
      updateData.sharedAt = Date.now();
    }
    
    const updatedQuote = await Quote.findOneAndUpdate(
      { _id: req.params.quoteId, user: req.loggedUser._id }, 
      updateData,
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
    // Trova la citazione per ID
    const quote = await Quote.findById(req.params.quoteId);
    
    // Verifica se la citazione esiste
    if (!quote) {
      return res.status(404).json({ message: 'Citazione non trovata' });
    }

    // Verifica se l'autore della citazione è lo stesso dell'utente autenticato
    if (quote.user.toString() !== req.loggedUser._id.toString()) {
      return res.status(403).json({ message: 'Non hai il permesso di eliminare questa citazione.' });
    }

    // Usa deleteOne per eliminare la citazione
    await Quote.deleteOne({ _id: quote._id });

    // Rimuovi la citazione dall'array delle citazioni dell'utente
    await User.findByIdAndUpdate(req.loggedUser._id, {
      $pull: { quotes: req.params.quoteId }, // Rimuove la citazione dall'array delle citazioni dell'utente
    });

    // Rimuovi la citazione dall'array delle citazioni del libro
    await Book.findByIdAndUpdate(quote.book, {
      $pull: { quotes: req.params.quoteId }, // Rimuove la citazione dall'array delle citazioni del libro
    });

    res.json({ message: 'Citazione eliminata con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore del server: ' + error.message });
  }
};

