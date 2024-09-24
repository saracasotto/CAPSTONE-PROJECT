import cloudinary from '../config/cloudinaryConfig.js'; 
import Book from '../models/bookModel.js';

export const addBook = async (req, res) => {
  try {
    let coverUrl = '';

    // Controlla se è presente un file immagine da caricare su Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream({ folder: 'books' }, (error, result) => {
          if (error) reject(error);
          resolve(result);
        });
        stream.end(req.file.buffer); // Carica il buffer del file immagine su Cloudinary
      });

      coverUrl = result.secure_url; // Salva l'URL della copertina caricata
    }

    const { title, author, category, barcode, publisher, description, status } = req.body;
    
    // Crea un nuovo libro, usando l'URL della copertina caricata (se presente) o l'URL di default gestito dallo schema
    const newBook = new Book({
      cover: coverUrl || undefined,  // Solo se c'è una copertina caricata, altrimenti usa il default dallo schema
      title,
      author,
      category,
      barcode,
      publisher,
      description,
      user: req.loggedUser._id, // Recupera l'ID dell'utente loggato
      status,
    });

    await newBook.save(); // Salva il libro nel database
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiunta del libro", error: error.message });
  }
};

// Funzione per ottenere i libri dell'utente loggato
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.loggedUser._id }).populate("category").lean();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero dei libri" });
  }
};

// Funzione per aggiornare un libro esistente
export const updateBook = async (req, res) => {
  try {
    const { title, author, category, progress, barcode, publisher, description, status } = req.body;
    const updatedBook = await Book.findOneAndUpdate(
      { _id: req.params.id, user: req.loggedUser._id }, 
      { title, author, category, progress, barcode, publisher, description, status }, 
      { new: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ message: "Libro non trovato o non autorizzato" });
    }
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiornamento del libro" });
  }
};


export const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findOneAndDelete({ _id: req.params.id, user: req.loggedUser._id });
    if (!deletedBook) {
      return res.status(404).json({ message: "Libro non trovato o non autorizzato" });
    }
    res.status(200).json({ message: "Libro eliminato con successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore nell'eliminazione del libro" });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const updatedBook = await Book.findOneAndUpdate(
      { _id: req.params.id, user: req.loggedUser._id }, 
      { progress }, 
      { new: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ message: "Libro non trovato o non autorizzato" });
    }
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiornamento del progresso di lettura" });
  }
};


//DA BACKEND SENZA AUTORIZZAZIONE

// Aggiungere un libro (POST)
export const addBookWithoutAuth = async (req, res) => {
  try {
    const { cover, title, author, category, barcode, publisher, description, status, user } = req.body;

    const newBook = new Book({
      cover,
      title,
      author,
      category,
      barcode,
      publisher,
      description,
      user,
      status,
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiunta del libro", error: error.message });
  }
};

// Ottenere tutti i libri (GET)
export const getAllBooksWithoutAuth = async (req, res) => {
  try {
    // Recupera tutti i libri dal database e popola i riferimenti a "User" e "Category"
    const books = await Book.find().populate('user', 'name email').populate('category', 'name');
    
    // Invia i dati dei libri
    res.status(200).json(books);
  } catch (error) {
    // Gestione degli errori
    res.status(500).json({ message: "Errore nel recupero dei libri", error: error.message });
  }
};

// Aggiornare un libro esistente (PUT)
export const updateBookWithoutAuth = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true }); // Aggiorna il libro con i nuovi dati

    if (!updatedBook) {
      return res.status(404).json({ message: "Libro non trovato" });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiornamento del libro", error: error.message });
  }
};

// Eliminare un libro esistente (DELETE)
export const deleteBookWithoutAuth = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id); // Elimina il libro dal database

    if (!deletedBook) {
      return res.status(404).json({ message: "Libro non trovato" });
    }

    res.status(200).json({ message: "Libro eliminato con successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore nell'eliminazione del libro", error: error.message });
  }
};

