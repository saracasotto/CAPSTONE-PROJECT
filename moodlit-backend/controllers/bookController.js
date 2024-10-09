import Book from '../models/bookModel.js';
import User from '../models/userModel.js';
import Note from '../models/noteModel.js';
import Quote from '../models/quoteModel.js';
import Category from '../models/categoryModel.js';


export const addBook = async (req, res) => {
  try {
    const { cover, title, author, category, newCategory, barcode, publisher, description, status, progress } = req.body;
    const userId = req.loggedUser.id; // Otteniamo l'ID dell'utente dal token JWT

    let categoryId;

    // Caso 1: creo nuova categoria
    if (newCategory) {
      const createdCategory = new Category({
        name: newCategory,
        user: userId,  // associo nuova categoria all'utente loggato
      });
      await createdCategory.save();
      categoryId = createdCategory._id;  //id categoria
    } else if (category) {

      // Caso 2: uso categoria esistente
      const foundCategory = await Category.findOne({ _id: category, user: userId });

      if (!foundCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      categoryId = foundCategory._id;
    } else {
      return res.status(400).json({ message: "Error getting category" });
    }

    // Creazione del nuovo libro con la categoria associata
    const newBook = new Book({
      cover: cover || 'https://res.cloudinary.com/dg3ztnyg9/image/upload/v1728463747/Moodlit/wfniu4yhpzswmjt2mmmf.png',
      title,
      author,
      category: categoryId, 
      barcode,
      publisher,
      description,
      status,
      progress,
      user: userId
    });

    await newBook.save();

    const user = await User.findById(userId);
    user.books.push(newBook._id);  // Aggiungi l'ID del libro appena creato all'array books
    await user.save();  // aggiorno utente

    // Aggiorniamo la categoria aggiungendo l'ID del libro alla categoria
    const categoryToUpdate = await Category.findById(categoryId);
    categoryToUpdate.books.push(newBook._id);
    await categoryToUpdate.save();

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: "Error adding book ", error: error.message });
  }
};

export const getBooks = async (req, res) => {
  try {
    const userId = req.loggedUser.id; // Otteniamo l'ID dell'utente dal token JWT
    const books = await Book.find({ user: userId }).populate('category', 'name'); // Recupera solo i libri dell'utente

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error getting books", error: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const userId = req.loggedUser.id; // Otteniamo l'ID dell'utente dal token JWT
    const bookId = req.params.id; // Otteniamo l'ID del libro dai parametri della richiesta

    // Trova il libro corrispondente all'ID, solo se appartiene all'utente autenticato
    const book = await Book.findOne({ _id: bookId, user: userId }).populate('category', 'name');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error getting book", error: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { cover, title, author, category, barcode, publisher, description, status } = req.body;
    const userId = req.loggedUser.id; // Otteniamo l'ID dell'utente dal token JWT

    // Trova il libro che appartiene all'utente loggato e aggiornalo
    const updatedBook = await Book.findOneAndUpdate(
      { _id: id, user: userId }, // Verifica che il libro appartenga all'utente
      { title, author, category, barcode, publisher, description, status, cover },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Error updating", error: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.loggedUser.id;

    // Trova il libro
    const book = await Book.findOne({ _id: id, user: userId });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Rimuovi il riferimento al libro dall'utente
    await User.findByIdAndUpdate(userId, { $pull: { books: id } });

    // Rimuovi il riferimento al libro dalla categoria
    if (book.category) {
      await Category.findByIdAndUpdate(book.category, { $pull: { books: id } });
    }

    // Elimina note e citazioni associate al libro
    await Note.deleteMany({ book: id });
    await Quote.deleteMany({ book: id });

    // Elimina il libro
    await Book.findByIdAndDelete(id);

    res.status(200).json({ message: "Book successfully deleted" });
  } catch (error) {
    console.error("Error in deleteBook:", error);
    res.status(500).json({ message: "Error deleting book", error: error.message });
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
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Error updating" });
  }
};

export const updateBookStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, totalPages } = req.body;
    const userId = req.loggedUser.id;

    const book = await Book.findOne({ _id: id, user: userId });

    if (!book) {
      return res.status(404).json({ message: "Libro non trovato" });
    }

    book.status = status;

    if (status === 'completed' && totalPages) {
      book.progress = totalPages;
    }

    await book.save();

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiornamento dello stato del libro", error: error.message });
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


