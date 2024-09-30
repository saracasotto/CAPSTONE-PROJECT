import { cloudinary, upload } from '../config/cloudinaryConfig.js'; 
import Book from '../models/bookModel.js';


export const addBook = async (req, res) => {
  try {
    let coverUrl = '';

    //se c'è immagine, salvo su cloudinary
    if (req.file) {

      //PATTERN RICHIEDE PROMISE MANUALE
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
    res.status(500).json({ message: "Error ", error: error.message });
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

export const getBookByIdWithoutAuth = async (req, res) => {
  try {
    console.log("ID ricevuto nel backend:", req.params.id); // Log per debug

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Libro non trovato' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel server' });
  }
};


// Aggiungere un libro (POST)
export const addBookWithoutAuth = async (req, res) => {
  try {
    const { cover, title, author, category, barcode, publisher, description, status, progress } = req.body;

    // Crea un nuovo libro, usando l'URL della copertina fornito dal frontend
    const newBook = new Book({
      cover: cover || 'https://res.cloudinary.com/dg3ztnyg9/image/upload/v1727198157/default/aaiyvs5jrwkz4pau30hi.png',  // Usa l'URL della copertina o un valore di default
      title,
      author,
      category,
      barcode,
      publisher,
      description,
      status,
      progress
    });

    await newBook.save();  // Salva il nuovo libro nel database
    res.status(201).json(newBook);  // Restituisce il nuovo libro come risposta
  } catch (error) {
    console.error("Errore nell'aggiunta del libro:", error.message);
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
    const { cover, title, author, category, barcode, publisher, description, status } = req.body;

    // Aggiorna il libro con i nuovi dati e la nuova copertina (se presente)
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, category, barcode, publisher, description, status, cover },
      { new: true }
    );

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

export const uploadBookCover = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nessuna immagine fornita' });
    }

    // Poiché il file è già caricato su Cloudinary, possiamo semplicemente restituire il percorso
    res.status(200).json({ coverUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ message: 'Errore nel caricamento della copertina', error: error.message });
  }
};


