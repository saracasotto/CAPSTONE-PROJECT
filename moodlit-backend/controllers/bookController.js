import Book from "../models/bookModel.js";


export const addBook = async (req, res) => {
  try {
    const { cover, title, author, category, barcode, publisher, description, status } = req.body;
    const newBook = new Book({
      cover,
      title,
      author,
      category,
      barcode,
      publisher,
      description,
      user: req.loggedUser._id,
      status,
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiunta del libro" });
  }
};

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.loggedUser._id }).populate("category").lean();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero dei libri" });
  }
};

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
